import React from "react";
import { AdminPropertySuites } from "../Admin/Content/property-suites";
import { AdminPropertyStandards } from "../Admin/Content/property-standards";
import { AdminPropertyRoomtypes } from "../Admin/Content/property-roomtypes";
import { AdminPropertyFacilities } from "../Admin/Content/property-facilities";
import { AdminPropertyProperties } from "../Admin/Content/property-properties";
import { AdminPropertyBeds } from "../Admin/Content/property-beds";
//Jag har skapat alla komponenter enskilt och har en sida dar jag importerar och visar alla komponenter som har med att lagga till, redigera och radera innehallet.
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
