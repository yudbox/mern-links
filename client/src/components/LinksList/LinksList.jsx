import React from "react";
import { Link } from "react-router-dom";

export const LinksList = ({ links }) => {
  console.log('links', links)
  if (!links.length) {
    return <p>There are no links</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Original link</th>
          <th>Saved link</th>
          <th>Open link</th>
        </tr>
      </thead>

      <tbody>
        {links.map((link, index) => {
          return (
            <tr key={link._id}>
              <td>{index + 1}</td>
              <td>{link.from}</td>
              <td>{link.to}</td>
              <td>
                <Link to={`/detail/${link._id}`}>Open</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
