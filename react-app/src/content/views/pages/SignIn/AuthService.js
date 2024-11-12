class AuthService {

    // 로그인 시도
    tryLogin(email, password, saveToken = true) {
        return new Promise((resolve, reject) => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(user => user.id === email);

            if (!user) {
                // 이메일이 존재하지 않는 경우
                reject(new Error('로그인 실패! 존재 하지 않는 이메일 입니다.'));
            } else if (user.password !== password) {
                // 비밀번호가 일치하지 않는 경우
                reject(new Error('로그인 실패! 비밀번호가 일치 하지 않습니다.'));
            } else {
                // 로그인 성공
                if (saveToken) {
                    localStorage.setItem('TMDb-Key', user.password); // 로그인 여부 확인용 키 저장
                }
                resolve(user);
            }
        });
    }
    // 회원가입 시도
    tryRegister(email, password, confirmPassword, acceptTerms) {
        return new Promise((resolve, reject) => {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userExists = users.some(existingUser => existingUser.id === email);

                if (!email || !password || !confirmPassword){
                    throw new Error('모든 필드를 입력해주세요.');
                }

                if (userExists) {
                    throw new Error('이미 존재하는 이메일입니다.');
                }

                if (!acceptTerms) {
                    throw new Error('약관에 동의해야 가입이 가능합니다.');
                }

                if (password !== confirmPassword)
                {
                    throw new Error('확인 비밀번호가 일치하지 않습니다.');
                }

                const newUser = { id: email, password: password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    isLoggedIn(){
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('TMDb-Key');
            if (token) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
}

export default new AuthService();