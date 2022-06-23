import React from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"

import validate from "../../../../../utils/validator"

const useStyles = makeStyles(theme => ({
  textField: {
    width: ({ fullWidth, settings }) =>
      fullWidth ? undefined : settings ? "15rem" : "19rem",
    [theme.breakpoints.down("xs")]: {
      width: ({ fullWidth }) => (fullWidth ? undefined : "15rem"),
    },
    [theme.breakpoints.up("xs")]: {
      width: ({ xs }) => (xs ? "10rem" : undefined),
    },
  },
  input: {
    color: ({ isWhite }) =>
      isWhite ? theme.palette.common.WHITE : theme.palette.secondary.main,
    fontSize: ({ xs }) => (xs ? "1.2rem" : undefined),
  },
}))

function Form({
  fields,
  errors,
  setErrors,
  values,
  setValues,
  isWhite,
  disabled,
  fullWidth,
  settings,
  xs,
  noError,
}) {
  const classes = useStyles({ isWhite, fullWidth, settings, xs })
  // console.log(`form values ->`, values)
  return Object.keys(fields).map(field => {
    const validateHelper = e => {
      return validate({ [field]: e.target.value })
    }

    return !fields[field].hidden ? (
      <Grid item key={field}>
        <TextField
          // values[field] === values.email for example
          value={values[field]}
          onChange={e => {
            const valid = validateHelper(e)

            if (!noError && (errors[field] || valid[field] === true)) {
              setErrors({ ...errors, [field]: !valid[field] })
            }
            setValues({ ...values, [field]: e.target.value })
          }}
          onBlur={e => {
            if (noError) return
            const valid = validateHelper(e)
            setErrors({ ...errors, [field]: !valid[field] })
          }}
          error={noError ? false : errors[field]}
          helperText={noError ? "" : errors[field] && fields[field].helperText}
          classes={{ root: classes.textField }}
          placeholder={fields[field].placeholder}
          type={fields[field].type}
          disabled={disabled}
          fullWidth={fullWidth}
          InputProps={{
            startAdornment: fields[field].startAdornment ? (
              <InputAdornment position="start">
                {fields[field].startAdornment}
              </InputAdornment>
            ) : undefined,
            endAdornment: fields[field].endAdornment ? (
              <InputAdornment position="end">
                {fields[field].endAdornment}
              </InputAdornment>
            ) : undefined,
            classes: { input: classes.input },
          }}
        />
      </Grid>
    ) : null
  })
}

export default Form
