module.exports = {
    rest:[
        {name:"/",method:"get",login:false},

        {name:"/web/register",method:"post",login:false},

        {name:"/users/show",method:"get",login:false},

        {name:"/auth/get_sigkey",method:"post",login:false},
        {name:"/auth/get_request_token",method:"post",login:false},
        {name:"/auth/login",method:"post",login:false},
        {name:"/auth/get_access_token",method:"post",login:false},

        {name:"/account/show",method:"get"},

        {name:"/posts/create",method:"post"},
        {name:"/posts/timeline",method:"get"},

        {name:"/applications/create",method:"post",isWeb:true},
        {name:"/applications/my",method:"get",isWeb:true},
        {name:"/applications/show",method:"get",isWeb:true}
    ],
    websocket:[
        {name:"/posts/timeline"}
    ]
}
