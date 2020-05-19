import React, { useState, useEffect } from "react";
import styles from "./assets/select.module.scss";

interface SelectProps {
  /** userlist */
  users?: object;
}

interface UserProps {
  name: string;
  email: string;
  ssn: string;
}

const filterList = (userList: UserProps[], searchTerm: string): UserProps[] => {
  const newArr = userList.filter(
    (user) => user.name.includes(searchTerm) || user.email.includes(searchTerm)
  );
  return newArr;
};

const getHighlightedText = (text: string, highlight: string): JSX.Element => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {" "}
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: 600 }
              : {}
          }
        >
          {part}
        </span>
      ))}{" "}
    </span>
  );
};

const Select: React.FC<SelectProps> = () => {
  const [hasError, setErrors] = useState(false);
  const [users, setUsers] = useState<UserProps[]>();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:3001/users");
      res
        .json()
        .then((res) => setUsers(res))
        .catch((err) => setErrors(err));
    }
    fetchData();
  }, []);

  let filteredArr: UserProps[] = [];
  if (typeof users !== "undefined") {
    filteredArr = filterList(users, "e");
  }

  return (
    <div className={styles.select_container}>
      <ul>
        {typeof filteredArr !== "undefined"
          ? filteredArr.map((user, key) => (
              <li key={key} value={user.name}>
                {getHighlightedText(user.name, "e")}
                {getHighlightedText(user.email, "e")}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default Select;
