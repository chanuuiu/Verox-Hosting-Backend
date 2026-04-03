const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const usersFile = path.join(dataDir, 'users.json');

const loadUsers = () => {
  try {
    if (!fs.existsSync(usersFile)) {
      return [];
    }
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

module.exports = { loadUsers, saveUsers };
