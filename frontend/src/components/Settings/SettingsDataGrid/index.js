import React from "react"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import { DataGrid } from "@material-ui/data-grid"
import { makeStyles } from "@material-ui/core/styles"
import BackwardsOutline from "../../../images/BackwardsOutline"

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  "@global": {
    ".MuiDataGrid-root .MuiDataGrid-colCellTitle": {
      fontWeight: 600,
    },
    ".MuiDataGrid-root .MuiDataGrid-iconSeparator": {
      display: "none",
    },
    ".MuiDataGrid-root .MuiDataGrid-colCellTitleContainer": {
      "justify-content": "center",
    },
    ".MuiDataGrid-root .MuiDataGrid-colCellMoving": {
      "background-color": "transparent",
    },
    ".MuiDataGrid-root .MuiDataGrid-cell": {
      "white-space": "pre-wrap",
      "max-height": "100% !important",
      "line-height": "initial !important",
      padding: "1rem",
      "padding-right": "calc(1rem + 26px)",
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      "font-weight": 600,
      "border-bottom": "2px solid white",
    },
    ".MuiDataGrid-root .MuiDataGrid-row": {
      "max-height": "100% !important",
    },
    ".MuiDataGrid-root .MuiDataGrid-footer": {
      "margin-top": "-11rem",
    },
    ".MuiTablePagination-caption": {
      color: theme.palette.common.WHITE,
    },
    ".MuiSvgIcon-root": {
      fill: theme.palette.common.WHITE,
    },
    ".MuiDataGrid-root .MuiDataGrid-columnsContainer": {
      "background-color": theme.palette.secondary.main,
      border: "none",
    },
    ".MuiDataGrid-root": {
      border: "none",
    },
    ".MuiDataGrid-root .MuiDataGrid-overlay": {
      bottom: "8rem",
    },
  },
  header: {
    height: "8rem",
    width: "100%",
    backgroundColor: theme.palette.secondary.main,
  },
  iconWrapper: {
    height: "4rem",
    width: "4rem",
  },
  // mainContainer: {},
  // mainContainer: {},
}))

function SettingsDataGrid({
  setSelectedSetting,
  rows,
  columns,
  setOpen,
  rowsPerPage,
}) {
  const classes = useStyles()
  return (
    <Grid item container classes={{ root: classes.mainContainer }}>
      <Grid item classes={{ root: classes.header }}>
        <IconButton onClick={() => setSelectedSetting(null)}>
          <div className={classes.iconWrapper}>
            <BackwardsOutline color="#fff" />
          </div>
        </IconButton>
      </Grid>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={rowsPerPage || 3}
        onRowClick={e => (setOpen ? setOpen(e.row.id) : null)}
        hideFooterSelectedRowCount
      />
    </Grid>
  )
}

export default SettingsDataGrid
