import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="header">
      <a
        className="header__link"
        href="https://github.com/polywrap/demos/tree/main/hello-world"
        target="_blank"
      >
        Source Code
      </a>
      <a
        className="header__link"
        href="https://app.ens.domains/name/helloworld.polywrap.eth"
        target="_blank"
      >
        ENS Domain
      </a>
      <a
        className="header__link"
        href="https://bafybeig7r7vm6vg7fkv4u57p6pj3t3a7li56zeiiu6nn7sx5lrlacy7lpi.ipfs.dweb.link/"
        target="_blank"
      >
        IPFS Package
      </a>
    </div>
  );
};
