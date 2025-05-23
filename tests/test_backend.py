from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_signup_and_match():
    resp = client.post('/signup', json={'username': 'alice', 'interests': 'ai'})
    assert resp.status_code == 200
    user_id = resp.json()['id']

    resp = client.post(f'/match/{user_id}')
    assert resp.status_code == 200
    assert 'matches' in resp.json()
