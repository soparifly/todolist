import React from "react";
import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import UUID from "react-uuid";

const headArray = ["DATE", "TIME", "TODO"];

const rememberSampleData = {
  r_id: "0001",
  r_date: "2021-09-08",
  r_time: "10:10:10",
  r_remember: "나의 리멤버 리스트",
  r_comp: false, //완료 여부
};

function RemList() {
  const rem_header = useCallback(() => {
    return headArray.map((text) => {
      return <th key={UUID()}>{text}</th>;
    });
  }, []);
  const [rememberList, setRememberList] = useState([]);
  /**
   * 로컬스토리지에 리멤버리스트를 파서로 변환하고
   * setRememberList를 통해 JSON을 가져와서 화면에 보여줌
   * 화면이 새로나타날때마다 해당 함수를 계속 소환하기 때문에 문법상의
   * 문제가 없지만
   * 문제개선이 필요함
   * 그래서 useCallback을 사용한다
   */
  /**
   * useEffect가 실행(호출할)함수를 선언하였다
   * 이함수는 화면이 rendering 될때 한번만 호출될 함수
   * 하지만 react에 의해서 현재 화면이 보여지는 상태가 되면
   * 이 함수를 계속해서 다시생성한다
   * 현재의 컴퓨터 성능으로는 큰문제가 없지만
   * 이러한 과정이 계속해서 반복된다면 메모리등에 문제를 일으킬 수 있다
   *
   * react16에서는 이러한 함수를 useCallback()으로 감싸도록 권장하고있다
   * useCallback()으로 감싸진 함수는 이전에 한번이라도 만들어진 경우는 그대로 재사용하고 없는경우에만 함수를 생성한다
   *
   */
  //   const fetchData = () => {
  const fetchCallback = useCallback(() => {
    const remString = localStorage.rememberList;

    if (remString) {
      console.log("Fetch rememberList");
      const remJSON = JSON.parse(remString);
      setRememberList(remJSON);
    }
  }, []);

  // const fetchCallback = useCallback(fetchData, []);
  // 현재 상태에 데이터가 없을때는 최초의 1회만 실행함
  // 최초에 rendering될때 (app이 시작될때, page가 열릴때, 새록고침할때)
  // fetchData를 실행함,
  //   useEffect(fetchCallback, [fetchData]);
  useEffect(fetchCallback, [fetchCallback]);

  /**
   * 객체 배열 sort하기
   * 배열.sort(compareFuction(p,n))
   * pre와 next에 번갈하면서 요소가 담긴다,
   * 두가지를 이용해서
   * 완료가되면    1을
   * 미완료일경우 -1을 return 한다
   *
   * compareFunction의 return 값에 따라서 배열의 위치가 교환된다
   * 만약에 return 값이 return 0보다 크냐 작냐에따라 next 앞으로 pre 뒤로
   * 이동시킨다
   *
   * map(), filter()는 결과를 return 하여 다른 배열을 생성한다
   * sort()는 자기자신을 변경한다
   *
   */
  const saveStorage = () => {
    console.log("EFFECT");
    if (rememberList.length > 0) {
      rememberList.sort((pre, next) => {
        if (pre.r_comp && !next.r_comp) return -1;
        if (!pre.r_comp && next.r_comp) return 1;
      });
      // return pre.r_comp
      //   ? 1
      //   : pre.r_date > next.r_date && pre.r_time > next.r_time
      //   ? -1
      //   : 0;

      localStorage.rememberList = JSON.stringify(rememberList);
    }
  };

  //useEffect(함수, 상태대상)
  // 화면에 rendering이 발생할때 실행되는 public event 연결
  // 일부러 호출하거나, 실행하지않아도
  // 어떤 조건이 발생하면 자동으로 호출되어실행되는함수
  //상태가 없으면 최초의 rendring될때 한번만 함수를 호출한다
  useEffect(saveStorage, [rememberList]);
  const trOnClick = (e) => {
    const td = e.target;
    if (td.tagName === "TD") {
      const uuid = td.closest("TR").dataset.uuid;
      const _list = rememberList.map((remember) => {
        if (remember.r_id === uuid) {
          return { ...remember, r_comp: !remember.r_comp };
        }
        return remember;
      });

      setRememberList([..._list]);
    }
  };
  const list_body = rememberList.map((remember) => {
    return (
      <tr
        key={remember.r_id}
        data-uuid={remember.r_id}
        className={remember.r_comp ? "comp" : ""}
        onDoubleClick={trOnClick}
      >
        <td>{remember.r_date}</td>
        <td>{remember.r_time}</td>
        <td>{remember.r_remember}</td>
      </tr>
    );
  });
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      const { value } = e.target;
      const remember = {
        r_id: UUID(),
        r_date: moment().format("YYYY[-]MM[-]DD"),
        r_time: moment().format("HH:mm:ss"),
        r_remember: value,
        r_comp: false,
      };
      setRememberList([...rememberList, remember]);
      e.target.value = "";
    }
  };
  /*
	const array = [1, 2, 3, 4, 5]
	const arCopy = [...array];
	요소 추가하고 복제하기
	const arCopyAdd = [...array, 9, 10];
	*/

  return (
    <div className="tbout">
      <table className="rem_list">
        <thead>
          <tr>{rem_header()}</tr>
        </thead>
        <tbody>
          {list_body}
          <tr>
            <td colSpan="2">TO DO</td>
            <td>
              <input
                onKeyDown={onKeyDown}
                name="r_remember"
                placeholder="What do you want!?"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RemList;
