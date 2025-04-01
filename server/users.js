import { trimStr } from "./utils.js";

let users = [];

const findUser = (polz) => {
  const userName = trimStr(polz.user);
  const userPass = trimStr(polz.pass);

  return users.find(
    (u) => trimStr(u.name) === userName && trimStr(u.pass) === userPass
  );
};

const addUser = (user) => {
  const isExist = findUser(user);

  if (!isExist) {
    users.push(user); // Добавляем только если пользователь не существует
    console.log("Пользователь добавлен:", user);
  }
  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
};

export { addUser, findUser };
