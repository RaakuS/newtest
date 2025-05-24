const api = 'http://localhost:8000';
let currentUserId = null;

document.getElementById('signup').onclick = async () => {
    const username = document.getElementById('username').value;
    const interests = document.getElementById('interests').value;
    const res = await fetch(`${api}/signup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, interests})
    });
    const data = await res.json();
    currentUserId = data.id;
    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
};

document.getElementById('getmatches').onclick = async () => {
    const res = await fetch(`${api}/match/${currentUserId}`, {method: 'POST'});
    const data = await res.json();
    const list = document.getElementById('matches');
    list.innerHTML = '';
    data.matches.forEach(m => {
        const li = document.createElement('li');
        li.innerText = `${m.user}: ${m.proposal}`;
        list.appendChild(li);
    });
};
