const STORAGE_NAME = 'register-data';

let data;

init();

function init() {
	loadData();
	makeTable();
}

function loadData() {
	data = localStorage.getItem(STORAGE_NAME);
	if (!data) return;
	data = JSON.parse(data);
}

function saveData() {
	localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
}

function makeTable() {
	document.querySelector('table tbody').innerHTML = '';
	data.forEach((item, idx) => {
		createRowHTML(item, idx)
	});
}

function createRowHTML(item, idx) {
	const tableBody = document.querySelector('table tbody');
	const xp = item.xp === 'true';
	tableBody.innerHTML += `
		<tr>
			<td>${item.name}</td>
			<td>${item.phone}</td>
			<td class="xp ${xp ? '' : 'no'}">${xp ? 'Sim' : 'Não'}</td>
			<td>
				<button onclick="onDeleteButton(${idx})">Excluir</button>
				<button onclick="onEditButton(${idx})">Editar</button>
			</td>
		</tr>
	`;
}

function onDeleteButton(idx) {
	data.splice(idx, 1);
	makeTable();
	saveData();
}

function onEditButton(idx) {
	window.location.href = `./src/form.html?personIdx=${idx}`;
}