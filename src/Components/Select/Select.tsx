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

// could i reuse the regexp to remove and match at the same time? Maybe that risks readability?
const filterList = (userList: UserProps[], searchTerm: string): UserProps[] => {
  console.log(userList);
  console.log(searchTerm);
  const regex = new RegExp(`(${searchTerm})`, "gi");
  const newArr = userList.filter(
    (user) => user.name.match(regex) || user.email.match(regex)
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
  const [searchValue, setSearchValue] = useState("");

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
    filteredArr = filterList(users, searchValue);
  }

  return (
    <div className={styles.select_container}>
      <form>
        <label>
          Name:
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </label>
      </form>
      {typeof users !== "undefined" && searchValue.length > 0 && (
        <ul>
          {filteredArr.length > 0 ? (
            filteredArr.map((user, key) => (
              <li key={key} value={user.name}>
                {getHighlightedText(user.name, searchValue)}
                {getHighlightedText(user.email, searchValue)}
              </li>
            ))
          ) : (
            <li>Engar niðurstöður</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Select;
