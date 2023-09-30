import React from "react";
import { AdminSettingsSuites } from "./property-settings-suites";
import { AdminSettingsFacilities } from "./property-settings-facilities";

export function AdminPropertySettings() {
  return (
    <div>
      <AdminSettingsSuites></AdminSettingsSuites>
      <AdminSettingsFacilities></AdminSettingsFacilities>
    </div>
  );
}
