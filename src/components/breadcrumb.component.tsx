import React, { Fragment } from "react";

export default function Breadcrumb(props: BreadcrumbProps) {
  const marginHorizonal3Style = { margin: "0px 3px" };
  const getPathLink = ({ name, href }: BreadcrumbPath) => (
    <Fragment key={name}>
      <i className="icon-chevron-right link" style={marginHorizonal3Style}></i>
      {href ? <a href={href}>{name}</a> : <span>{name}</span>}
    </Fragment>
  );

  return (
    <div className="breadcrumb">
      <a href="/openmrs">
        <i className="icon-home small"></i>
      </a>
      {props.paths.map(path => getPathLink(path))}
    </div>
  );
}

type BreadcrumbProps = {
  paths: BreadcrumbPath[];
};

export type BreadcrumbPath = {
  name: string;
  href?: string;
};
