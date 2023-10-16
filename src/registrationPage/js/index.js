//Validation fields check

const loginTemplate = /^[a-zA-Z](.[a-zA-Z0-9_-]*){3,16}$/
const emailTemplate = /^[\w-\.]+@[\w-]+\.[a-z]{2,5}$/
const passwordTemplate = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

let isCorrectFields = {
    login: 'invalid',
    email: 'invalid',
    password: 'invalid',
    passwordConfirmation: 'invalid'
}

function checkValidation(fieldId) {
    switch (fieldId) {
        case 'login':
            checkLogin(fieldId)
            checkAllFields('button-reg')
            break
        case 'email':
            checkEmail(fieldId)
            checkAllFields('button-reg')
            break
        case 'password':
            checkPassword(fieldId)
            checkAllFields('button-reg')
            break
        case 'passwordConfirmation':
            checkPasswordConfitmation(fieldId)
            checkAllFields('button-reg')
            break

    }
}

function checkLogin(loginId) {
    let login = document.getElementById(loginId)
    if (login.value.length == 0) {
        document.getElementById('loginCorrection').style.display = "none"
        login.style.color = 'black'
        isCorrectFields.login = 'invalid'
        return 0
    }
    if (!loginTemplate.test(login.value)) {
        document.getElementById('loginCorrection').style.display = "block"
        document.getElementById('loginCorrection').innerHTML = "Логин должен быть не меньше 4 и не больше 16 символов и не должен начинаться с цифры"
        isCorrectFields.login = 'invalid'
        return 1
    }
    document.getElementById('loginCorrection').style.display = "none"
    login.style.color = 'black'
    isCorrectFields.login = 'valid'
}


function checkEmail(emailId) {
    let email = document.getElementById(emailId)
    if (email.value.length == 0) {
        document.getElementById('emailCorrection').style.display = "none"
        email.style.color = 'black'
        isCorrectFields.email = 'invalid'
        return 0
    }
    if (!emailTemplate.test(email.value)) {
        document.getElementById('emailCorrection').style.display = "block"
        document.getElementById('emailCorrection').innerHTML = "Адрес электронной почты должен содержать '@' и доменное имя (.ru/.com и др.)"
        isCorrectFields.email = 'invalid'
        return 1
    }
    document.getElementById('emailCorrection').style.display = "none"
    email.style.color = 'black'
    isCorrectFields.email = 'valid'
}

function checkPassword(passwordId) {
    checkPasswordConfitmation('passwordConfirmation')
    let password = document.getElementById(passwordId)
    if (password.value.length == 0) {
        document.getElementById('passwordCorrection').style.display = "none"
        password.style.color = 'black'
        isCorrectFields.password = 'invalid'
        return 0
    }
    if (!passwordTemplate.test(password.value)) {
        document.getElementById('passwordCorrection').style.display = "block"
        document.getElementById('passwordCorrection').innerHTML = "Пароль должен быть не меньше 8 символов, содержать строчные и заглавные буквы латинского алфавита и спец. символы(%, $, #, и др.)"
        password.style.color = 'red'
        isCorrectFields.password = 'invalid'
        return 1
    }
    document.getElementById('passwordCorrection').style.display = "none"
    password.style.color = 'black'
    isCorrectFields.password = 'valid'
}

function checkPasswordConfitmation(passwordId) {
    let passwordConfirmation = document.getElementById(passwordId)
    let password = document.getElementById('password')
    if (passwordConfirmation.value.length == 0) {
        document.getElementById('passwordConfirmationCorrection').style.display = "none"
        passwordConfirmation.style.color = 'black'
        isCorrectFields.passwordConfirmation = 'invalid'
        return 0
    }
    if (passwordConfirmation.value != password.value) {
        document.getElementById('passwordConfirmationCorrection').style.display = "block"
        document.getElementById('passwordConfirmationCorrection').innerHTML = "Пароли не совпадают"
        passwordConfirmation.style.color = 'red'
        isCorrectFields.passwordConfirmation = 'invalid'
        return 1
    }
    document.getElementById('passwordConfirmationCorrection').style.display = "none"
    passwordConfirmation.style.color = 'black'
    isCorrectFields.passwordConfirmation = 'valid'
}

function checkAllFields(butId) {
    if (isCorrectFields.email == 'valid' && isCorrectFields.password == 'valid' && isCorrectFields.passwordConfirmation == 'valid' && isCorrectFields.login == 'valid') {
        document.getElementById(butId).removeAttribute('disabled')
        return true
    }
    else
        document.getElementById(butId).setAttribute('disabled', true)
    return false
}
