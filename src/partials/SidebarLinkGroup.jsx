import React, { useState } from 'react';

function SidebarLinkGroup({
  children,
  activecondition,
}) {

  const [open, setOpen] = useState(activecondition);

  const handleClick = () => {
    setOpen(!open);
  }

  return (
    <ul
      className={` rounded-2xl mb-0.5 last:mb-0 transition duration-150 ease-in-out ${
        activecondition &&
        "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
      }`}
    >
      {children(handleClick, open)}
    </ul>
  );
}

export default SidebarLinkGroup;