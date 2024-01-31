async function handleSignin(){
    document.getElementById("rgBtn").style.display = "none";
    document.getElementById("loadingOverlay").classList.remove("d-none");
    document.getElementById("loadingSpinner").classList.remove("d-none");

    Repeatpassword = document.getElementById("floatingInputRepeatPassword").value

    const signupData = {
    username : document.getElementById("floatingInputUsername").value,
    password : document.getElementById("floatingInputPassword").value,
    biz_owner : document.getElementById("floatingInputBizOwner").value,
    biz_no : document.getElementById("floatingInputBizNo").value,
    cust_id : "",
    biz_email : document.getElementById("floatingInputBizEmail").value,
    test_code : "test"
    }

    if (Repeatpassword != signupData.password){
        document.getElementById("rgBtn").style.display = "block";
        document.getElementById("loadingOverlay").classList.add("d-none");
        document.getElementById("loadingSpinner").classList.add("d-none");
        alert("패스워드가 일치하지 않습니다.")
        document.getElementById("floatingInputRepeatPassword").focus();
        return
    }

    const response = await fetch(`/users/`, {
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify(signupData)
    })
    document.getElementById("rgBtn").style.display = "block";
    document.getElementById("loadingOverlay").classList.add("d-none");
    document.getElementById("loadingSpinner").classList.add("d-none");

    response_json = await response.json()

    if(response.status == 200){
        alert("회원가입이 완료되었습니다.\n로그인해주세요.")
        window.location.replace(loginPath);
    } else if(response.status == 403){
        alert(`아름넷에 등록되지 않은 사업자이거나\n사업자번호 확인 또는 관리자에게 문의하세요.`)
    } else if(response.status == 400){
        if (response_json.message == 'username'){
            alert('이미 사용되는 아이디거나 입력되지 않았습니다.');
            document.getElementById("floatingInputUsername").focus();
        } else if (response_json.message == 'biz_no'){
            alert('이미 등록된 사업자번호이거나 대표자와 일치하지 않습니다.');
            document.getElementById("floatingInputBizOwner").focus();
        } else if (response_json.message == 'biz_email'){
            alert('이메일 양식이 맞지 않습니다.');
            document.getElementById("floatingInputBizEmail").focus();
        } else {
            alert('잘못된 요청입니다.');
        }
    }
}

async function handleLogin(){
    document.getElementById("lgBtn").style.display = "none";
    document.getElementById("loadingOverlay").classList.remove("d-none");
    document.getElementById("loadingSpinner").classList.remove("d-none");


    const loginData = {
        username : document.getElementById("floatingInputUsername").value,
        password : document.getElementById("floatingInputPassword").value,
    }

    const response = await fetch(`/users/api/token/`, {
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify(loginData)
    })

    response_json = await response.json()
    document.getElementById("lgBtn").style.display = "block";
    document.getElementById("loadingOverlay").classList.add("d-none");
    document.getElementById("loadingSpinner").classList.add("d-none");

    if(response.status == 200){

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        window.location.replace(indexPath);
    }else {
        if (response.status == 401){
            alert("아이디, 비밀번호를 확인하세요.\n계정이 없다면 회원가입을 진행해 주세요.")
        } else if (response.status == 400) {
            alert("잘못된 요청입니다.")
        }
    }
}

async function handleLogout(){
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");
    localStorage.removeItem("username");
    localStorage.removeItem("biz_owner");
    localStorage.removeItem("cust_nm");
    localStorage.removeItem("biz_no");
    // alert("로그아웃되었습니다.")
    location.reload();
}