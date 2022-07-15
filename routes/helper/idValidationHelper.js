

const isTutorId = (id) => {
    return id % 2 === 0 // tutor id is always even
}

const isAdminOrStudentId = (id) => {
    return id % 2 === 1 // admin / student id is always odd
}

export {
    isTutorId,
    isAdminOrStudentId
}