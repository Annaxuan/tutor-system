import s3 from "../../s3Client.js";

const USER_BUCKET = "uplust-user"
const COURSE_BUCKET = "uplust-course"
const MESSAGE_BUCKET = "uplust-messages"

/**
 * Reference to User Profile Picture
 */
export class UserProfilePictureReference {
	constructor(accountOrTutorId) {
		this.bucket = USER_BUCKET
		if (accountOrTutorId) {
			this.key = `${accountOrTutorId}/profilePicture`
		} else {
			this.key = `default`
		}
	}

	putParam(body, metadata) {
		return {Bucket: this.bucket, Key: this.key, Body: body, Metadata: metadata}
	}

	putACLParam() {
		return {Bucket: this.bucket, Key: this.key, ACL: "private"}
	}

	getParam() {
		return {Bucket: this.bucket, Key: this.key}
	}

	deleteParam() {
		return {Bucket: this.bucket, Key: this.key}
	}

	urlParam() {
		return {Bucket: this.bucket, Key: this.key}
	}

	static getDefault() {
		return new UserProfilePictureReference()
	}
}

/**
 * Reference to Course Picture
 */
export class CoursePictureReference {
	constructor(courseId) {
		this.bucket = COURSE_BUCKET
		this.key = `${courseId}/coursePicture`
	}

	putParam(body, metadata) {
		return {Bucket: this.bucket, Key: this.key, Body: body, Metadata: metadata}
	}

	putACLParam() {
		return {Bucket: this.bucket, Key: this.key, ACL: "private"}
	}

	getParam() {
		return {Bucket: this.bucket, Key: this.key}
	}

	deleteParam() {
		return {Bucket: this.bucket, Key: this.key}
	}

	urlParam() {
		return {Bucket: this.bucket, Key: this.key}
	}
}

/**
 * Reference to a file uploaded for a connection
 */
export class MessageFileReference {
	constructor(connectionId, fileName) {
		this.bucket = MESSAGE_BUCKET
		this.key = `${connectionId}/${fileName}`
	}

	putParam(body, metadata) {
		return {Bucket: this.bucket, Key: this.key, Body: body, Metadata: metadata}
	}

	putACLParam() {
		return {Bucket: this.bucket, Key: this.key, ACL: "private"}
	}

	getParam() {
		return {Bucket: this.bucket, Key: this.key}
	}

	deleteParam() {
		return {Bucket: this.bucket, Key: this.key}
	}

	urlParam() {
		return {Bucket: this.bucket, Key: this.key}
	}

	static fromListReferenceResult(listResult) {
		const ref = new MessageFileReference(-1, "") // holder
		ref.bucket = listResult.Bucket
		ref.key = listResult.Key
		return ref
	}
}

/**
 * Reference to the list of file for a connection
 */
export class MessageFileListReference {
	constructor(connectionId) {
		this.bucket = MESSAGE_BUCKET
		this.prefix = `${connectionId}/`
	}

	listParam(maxKeys, marker) {
		return {
			Bucket: this.bucket,
			Prefix: this.prefix,
			Delimiter: '/',
			Marker: marker ? marker : undefined,
			MaxKeys: maxKeys ? maxKeys : undefined
		}
	}
}

/**
 * Check if a reference exist
 *
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
 */
export const exists = async (reference) => {
	return s3.headObject(reference.urlParam()).promise().then(() => true).catch(error => {
		if (error.code === "NotFound") {
			return false
		} else {
			throw error
		}
	})
}

/**
 * Put the file to AWS S3.
 *
 * Example:
 * ```
 * // create a reference to the file named "myFile.txt" for the connection with id 1
 * const reference = new MessageFileReference(1, "MyFile.txt")
 * // put the reference and metadata to S3 bucket
 * const metadata = {senderId: 1}
 * await put(reference, fileStream, metadata)
 * ```
 *
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
 */
export const put = async (reference, readFileStream, metadata, ...putParam) => {
	// put the file
	await s3.putObject(reference.putParam(readFileStream, metadata, ...putParam)).promise();
	// then put the access control
	await s3.putObjectAcl(reference.putACLParam()).promise()
}

/**
 * List the file in the reference.
 *
 * Example:
 * ```
 * // create a reference to list of file for the connection with id 1
 * const reference = new MessageFileListReference(1)
 * // retrieve all files at most 100 file at a time
 * const maxKeysPerIteration = 100
 * let hasNextList = true
 * let marker = null
 * const files = []
 * while(hasNextList) {
 *     const fileListResult = await list(reference, maxKeysPerIteration, marker)
 *     files.push(...fileListResult.Contents)
 *     hasNextList = fileListResult.HasNextList
 *     marker = fileListResult.NextMarker
 * }
 * // get the reference of each file
 * files.map(MessageFileReference.fromListReferenceResult)
 *      .map(async ref => {
 * 	        console.log(await get(ref).promise())
 *      })
 * ```
 *
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
 */
export const list = async (reference, maxKeys = 100, marker = null, ...listParams) => {
	const listResult = await s3.listObjects(reference.listParam(maxKeys, marker, ...listParams)).promise()
	return {
		HasNextList: listResult.IsTruncated,
		NextMarker: listResult.NextMarker,
		Contents: listResult.Contents.map(content => {
			return {
				Bucket: listResult.Name, Key: content.Key,
				LastModified: content.LastModified, Size: content.Size, Owner: content.Owner
			}
		})
	}
}

/**
 * Retrieve the reference
 *
 * Example:
 * ```
 * // create a reference to the file named "myFile.txt" for the connection with id 1
 * const reference = new MessageFileReference(1, "MyFile.txt")
 * // get the resource and pipe it to response
 * get(reference).createReadStream().pipe(response)
 * ```
 *
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
 */
export const get = (reference, ...getParams) => {
	return s3.getObject(reference.getParam(...getParams))
}

/**
 * Delete a single reference
 */
export const deleteSingle = async (reference, ...deleteParams) => {
	return await s3.deleteObject(reference.deleteParam(...deleteParams)).promise()
}

/**
 * Delete a batch of references from the *SAME bucket*.
 */
export const deleteBatch = async (referenceList) => {
	if(referenceList === 0) return
	const bucket = referenceList[0].bucket
	return await s3.deleteObjects({
		Bucket: bucket,
		Delete: {
			Objects: referenceList.map(reference => {
				return {Key: reference.key}
			})
		}
	}).promise()
}

/**
 * Generate an url for a reference
 *
 * Note: You should not use this method, since by default the references have private access.
 * Meaning the url will not work without the owner's authorization header.
 *
 * **Use {@code get} instead.**
 *
 * @deprecated
 */
export const getReferenceUrl = (reference) => {
	return getUrl(reference.urlParam())
}

/**
 * Generate an url for the Bucket and Key
 *
 * Note: You should not use this method, since by default the references have private access.
 * Meaning the url will not work without the owner's authorization header.
 *
 * **Use {@code get} instead.**
 *
 * @deprecated
 */
export const getUrl = ({Bucket, Key}) => {
	return `https://${Bucket}.s3.ca-central-1.amazonaws.com/${Key}`
}

/**
 * Get a pre-signed url to the reference (expires after 300 second).
 *
 * Example:
 * ```
 * const reference = new MessageFileReference(1, "MyFile.txt")
 * const preSignedUrl = await getSignedUrl(reference)
 * ```
 */
export const getSignedUrl = async (reference) => {
	return await s3.getSignedUrlPromise("getObject", reference.getParam());
}

/**
 * Gets metadata for a file
 *
 * @param reference should contain at least a Key and a Bucket
 */
export const getMetadata = async (reference) => {
	return await s3.headObject(reference.getParam()).promise();
}
