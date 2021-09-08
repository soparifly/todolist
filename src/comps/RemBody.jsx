import React from "react";
// 상대경로인 index
// 아니면 ./comps
// import { RemList } from "./index";
import { RemList } from "../comps";

function RemBody() {
  return (
    <section className="main_section">
      <RemList />
    </section>
  );
}

export default RemBody;
