import React from "react";
import { AdminSettingsSuites } from "./property-settings-suites";
import { AdminSettingsFacilities } from "./property-settings-facilities";
import { AdminSettingsBeds } from "./property-settings-beds";

export function AdminPropertySettings() {
  return (
    <div>
      <AdminSettingsSuites></AdminSettingsSuites>
      <AdminSettingsFacilities></AdminSettingsFacilities>
      <AdminSettingsBeds></AdminSettingsBeds>
    </div>
  );
}
