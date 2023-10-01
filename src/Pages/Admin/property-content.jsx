import React from "react";
import { AdminPropertySuites } from "../Admin/Content/property-suites";
import { AdminPropertyStandards } from "../Admin/Content/property-standards";
import { AdminPropertyRoomtypes } from "../Admin/Content/property-roomtypes";
import { AdminPropertyFacilities } from "../Admin/Content/property-facilities";
import { AdminPropertyProperties } from "../Admin/Content/property-properties";
import { AdminPropertyBeds } from "../Admin/Content/property-beds";

export function AdminPropertyContent() {
  return (
    <div className="PropertyContentContainer">
      <AdminPropertySuites></AdminPropertySuites>
      <AdminPropertyStandards></AdminPropertyStandards>
      <AdminPropertyRoomtypes></AdminPropertyRoomtypes>
      <AdminPropertyBeds></AdminPropertyBeds>
      <AdminPropertyFacilities></AdminPropertyFacilities>
      <AdminPropertyProperties></AdminPropertyProperties>
    </div>
  );
}
