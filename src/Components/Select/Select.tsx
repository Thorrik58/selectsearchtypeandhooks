import React, { FC, useState, useEffect } from "react";
import styles from "./assets/select.module.scss";
import cx from "classnames";
import { ReactComponent as SearchIcon } from "./assets/Search.svg";

interface UserProps {
  name: string;
  email: string;
  ssn: string;
}

const numberOfMatches = (user: UserProps, searchTerm: string): Number => {
  const re = new RegExp(`(${searchTerm})`, "gi");
  return (
    ((user.name || "").match(re) || []).length +
    ((user.email || "").match(re) || []).length
  );
};

const filterList = (userList: UserProps[], searchTerm: string): UserProps[] => {
  const newArr = userList.filter(
    (user) => numberOfMatches(user, searchTerm) > 0
  );
  const sortedNewArr = newArr.sort((a, b) => {
    if (numberOfMatches(a, searchTerm) > numberOfMatches(b, searchTerm)) {
      return -1;
    }
    if (numberOfMatches(b, searchTerm) > numberOfMatches(a, searchTerm)) {
      return 1;
    }
    return 0;
  });
  return sortedNewArr;
};

const createHighLightedText = (
  text: string,
  searchTerm: string,
  subText: boolean
): JSX.Element => {
  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return (
    <p className={subText ? styles.sub_text : styles.text}>
      {parts.map((part, i) => (
        <span
          key={i}
          className={cx(
            part.toLowerCase() === searchTerm.toLowerCase()
              ? styles.highlighted_text
              : null
          )}
        >
          {part}
        </span>
      ))}
    </p>
  );
};

const Select: FC = () => {
  const [hasError, setErrors] = useState(false);
  if (hasError) {
    console.warn(`Error fetching user data ${hasError}`);
  }
  const [users, setUsers] = useState<UserProps[]>();
  const [searchValue, setSearchValue] = useState("");
  const [activeUser, setActiveUser] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    fetch("http://localhost:3001/users")
      .then((response) => response.json())
      .then((data) => {
        if (isCurrent) {
          setUsers(data);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          setErrors(err);
        }
      });
  }, []);

  const handleOnKeyDown = (keyCode: number) => {
    if (keyCode === 40) {
      setActiveUser(
        activeUser === filteredAndSortedArr.length - 1
          ? activeUser
          : activeUser + 1
      );
    }
    if (keyCode === 38) {
      setActiveUser(activeUser === 0 ? activeUser : activeUser - 1);
    }
  };

  let filteredAndSortedArr: UserProps[] = [];
  // make the user array sent in through props, fetch in app.tsx
  if (typeof users !== "undefined") {
    filteredAndSortedArr = filterList(users, searchValue);
  }

  return (
    <div className={styles.select_container}>
      <form autoComplete={"off"}>
        <div className={cx(styles.input_container)}>
          <SearchIcon className={styles.icon} />
          <input
            type="text"
            name="search"
            className={cx(
              styles.input_field,
              searchValue.length === 0 ? styles.placeholder_text : null
            )}
            placeholder="Þekktir viðtakendur"
            value={searchValue}
            onKeyDown={(e) => {
              if (e.keyCode === 40 || e.keyCode === 38) {
                handleOnKeyDown(e.keyCode);
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setActiveUser(0);
            }}
          />
          <label className={styles.aux} htmlFor="search">
            Search for name:
          </label>
        </div>
      </form>
      {typeof users !== "undefined" && searchValue.length > 0 && (
        <ul className={styles.user_list} tabIndex={-1}>
          {filteredAndSortedArr.length > 0 ? (
            filteredAndSortedArr.map((user, key) => (
              <li
                key={key}
                tabIndex={0}
                value={user.name}
                onMouseOver={() => {
                  setActiveUser(key);
                }}
                onFocus={() => {
                  setActiveUser(key);
                }}
                className={cx(
                  styles.user_element,
                  key === activeUser ? styles.active_user : null
                )}
              >
                {createHighLightedText(user.name, searchValue, false)}
                {createHighLightedText(user.email, searchValue, true)}
              </li>
            ))
          ) : (
            <li className={styles.no_results}>Engar niðurstöður</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Select;
