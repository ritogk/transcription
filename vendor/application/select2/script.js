const createSelect2 = () => {
  $("#language").select2({
    theme: "bootstrap-5",
    containerCssClass: "select2--medium", // For Select2 v4.0
    selectionCssClass: "select2--medium", // For Select2 v4.1
    dropdownCssClass: "select2--medium",
  })
}
