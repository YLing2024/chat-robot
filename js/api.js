/**
 *
 * @param {string} user
 * @param {string} pwd
 * @return {object} promise,数据为一个对象，通过statute判断是否登录成功，失败的话在msg有信息
 */
async function login(user, pwd) {
    //登录
    const logInfo = {
        loginId: user,
        loginPwd: pwd,
    };
    const req = await fetch("http://study.duyiedu.com/api/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(logInfo),
    });
    const body = await req.json();
    return {
        statute: !Boolean(body.code), //登录状态
        msg: body.msg, //错误信息
        token: req.headers.get("Authorization"), //拿到token
        loginData: body.data, //获取到用户详细信息
    };
}
/**
 *
 * @param {string} user
 * @return {object} promise，数据为对象，保存状态和错误信息
 */
async function exists(user) {
    //验证账号
    return fetch(
        `http://study.duyiedu.com/api/user/exists?loginId=${user}`
    ).then((data) => {
        return data.json();
    });
}

async function register(user, pwd, nickName) {
    const statute = (await exists(user)).data;
    if (statute) {
        return; //如果账号已经存在,不注册
    }
    return fetch(`http://study.duyiedu.com/api/user/reg`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            loginId: user,
            nickname: nickName,
            loginPwd: pwd,
        }),
    }).then((data) => {
        return data.json();
    });
}

async function userInfo(token) {
    return fetch(`http://study.duyiedu.com/api/user/profile`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
    }).then(async (data) => {
        return data.json();
    });
}

async function sendMsg(token, content) {
    return fetch("http://study.duyiedu.com/api/chat", {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: content,
        }),
    }).then((data) => {
        return data.json();
    });
}

async function history(token) {
    return fetch("http://study.duyiedu.com/api/chat/history", {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
    }).then((data) => {
        return data.json();
    });
}
