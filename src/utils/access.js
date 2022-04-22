export default function (accessKey) {
    const access = JSON.parse(localStorage.getItem('access'));
    const isSuperUser = localStorage.getItem('isSuperUser');
    return isSuperUser ? true : access ? access.includes(accessKey) : true;
}
