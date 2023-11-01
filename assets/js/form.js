const MIN_NAME_SIZE = 4;
const MAX_NAME_SIZE = 50;
const PHONE_SIZE = 11;
const STORAGE_NAME = 'register-data';

let data;
let personIdx = -1;

init();

function init() {
	personIdx = getPersonIdx();
	loadData();
	if (personIdx > data.length) {
		personIdx = -1;
	}
	fillInForm();
}

function getPersonIdx() {
	const url = new URL(window.location.href);
	return url.searchParams.get('personIdx') || -1;
}

function loadData() {
	data = JSON.parse(localStorage.getItem(STORAGE_NAME)) || [];
	console.log(data);
}

function fillInForm() {
	if (personIdx === -1 || personIdx > data.length) {
		return;
	}
	document.querySelector('#name').value = data[personIdx].name;
	document.querySelector('#phone').value = data[personIdx].phone;
	if (data[personIdx].xp === 'true') {
		document.querySelector('#xp-yes').checked = true;
	} else {
		document.querySelector('#xp-no').checked = true;
	}
}
function clearForm() {
	document.querySelector('#name').value = '';
	document.querySelector('#phone').value = '';
	document.querySelector('#xp-no').checked = true;
}

function onNameChange(e) {
	e.target.value = e.target.value.substring(0, Math.min(e.target.value.length, MAX_NAME_SIZE));
}

function onNameBlur(e) {
	if (e.target.value.length === 0) return;
	const result = validateName();
	if (result !== 'ok') {
		showValidationError(result);
	}
}

function getRawPhone() {
	let result = document.querySelector('#phone').value.match(/[0-9]+/g) || [];
	result = result.join('');
	result = result.substring(0, Math.min(result.length, 11));
	return result;
}

function onPhoneChange(e) {
	const numbers = getRawPhone();
	let formattedNumber = '';
	if (numbers.length > 0) {
		formattedNumber += `(${numbers.substring(0, 2)}`;
	}
	if (numbers.length > 2) {
		formattedNumber += `) ${numbers.substring(2, 7)}`;
	}
	if (numbers.length > 7) {
		formattedNumber += `-${numbers.substring(7)}`;
	}
	e.target.value = formattedNumber;
}

function onPhoneBlur(e) {
	if (e.target.value.length === 0) return;
	const result = validatePhone();
	if (result !== 'ok') {
		showValidationError(result);
	}
}

function showValidationError(error) {
	let message = '';
	switch (error) {
		case 'name-short':
			message = 'O nome deve ter mais de 4 caracteres.';
			break;
		case 'name-long':
			message = 'O nome não deve ter mais de 50 caracteres.';
			break;
		case 'phone-error':
			message = 'O telefone deve ter 11 dígitos.';
	}
	if (message !== '') {
		alert(message);
		return true;
	}
	return false;
}

function makePerson() {
	return {
		name: document.querySelector('#name').value,
		phone: document.querySelector('#phone').value,
		xp: document.querySelector('#xp-yes').checked.toString()
	}
}

function validateName() {
	const nameText = document.querySelector('#name').value;
	if (nameText.length <= MIN_NAME_SIZE) {
		return 'name-short';
	} else if (nameText.length > MAX_NAME_SIZE) {
		return 'name-long';
	}
	return 'ok';
}

function validatePhone() {
	if (getRawPhone().length !== PHONE_SIZE) {
		return 'phone-error';
	}
	return 'ok';
}

function saveButtonClick(e) {
	e.preventDefault();
	if (showValidationError(validateName()) || showValidationError(validatePhone())) {
		return;
	}
	if (personIdx < 0) {
		data.push(makePerson());
	} else {
		data[personIdx] = makePerson();
	}
	localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
	if (personIdx !== -1) {
		window.location.href = '../index.html';
		return;
	}
	personIdx = -1;
	clearForm();
}