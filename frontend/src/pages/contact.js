import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import clsx from "clsx"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { Link } from "gatsby"

import address from "../images/address.svg"
import phone from "../images/phone-adornment.svg"
import Email from "../images/EmailAdornment"
import send from "../images/send.svg"
import nameAdornment from "../images/name-adornment.svg"

import Layout from "../components/ui/layout"
import validate from "../../utils/validator"
// import Image from "../components/image"
// import SEO from "../components/seo"

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: "45rem",
    backgroundColor: theme.palette.primary.main,
    marginBottom: "10rem",
    [theme.breakpoints.down("md")]: {
      marginTop: "8rem",
      height: "90rem",
    },
  },
  formContainer: {
    height: "100%",
    //     [theme.breakpoints.down("md")]: {
    //       height: "100%",

    // },
  },
  formWrapper: {
    height: "100%",
    [theme.breakpoints.down("md")]: {
      height: "50%",
      marginTop: "16rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  blockContainer: {
    backgroundColor: theme.palette.secondary.main,
    height: "8rem",
    width: "40rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "30rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  titleContainer: {
    marginTop: "-4rem",
  },
  buttonContainer: {
    marginBottom: "-4rem",
    textTransform: "none",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  sendIcon: {
    marginLeft: "2rem",
  },
  contactInfo: {
    fontSize: "1.5rem",
    marginLeft: "1rem",
  },
  contactIcon: {
    height: "3rem",
    width: "3rem",
    // marginRight: "2rem",
  },
  contactEmailIcon: {
    height: "2.25rem",
    width: "3rem",
    // marginRight: "2rem",
  },
  emailAdornment: {
    height: 17,
    width: 22,
    marginBottom: 10,
  },
  infoContainer: {
    height: "21.25rem",
    [theme.breakpoints.down("sm")]: {
      height: "15.25rem",
    },
  },
  middleInfo: {
    borderTop: "2px solid #fff",
    borderBottom: "2px solid #fff",
    // padding: "1rem 0",
  },
  iconContainer: {
    borderRight: "2px solid #fff",
    height: "7rem",
    width: "8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      height: "5rem",
      width: "6rem",
    },
  },
  textField: {
    width: "30rem",
    [theme.breakpoints.down("sm")]: {
      width: "20rem",
    },
  },
  input: {
    color: theme.palette.common.WHITE,
    "&::placeholder": {
      color: theme.palette.common.WHITE,
    },
  },
  fieldContainer: {
    marginBottom: "1rem",
  },
  multilineContainer: {
    marginTop: "1rem",
  },
  multiline: {
    border: "2px solid #fff",
    borderRadius: 15,
    padding: "1rem",
  },
  multilineError: {
    border: `2px solid ${theme.palette.error.main}`,
  },
  buttonDisabled: {
    backgroundColor: theme.palette.grey[500],
  },
  sendMessage: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "2.5rem",
    },
  },
  "@global": {
    ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "2px solid #fff",
    },
    ".MuiInput-underline:after": {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
  },
}))

const ContactPage = () => {
  const classes = useStyles()
  const theme = useTheme()

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const fields = {
    name: {
      helperText: "Name must be longer than 2 characters",
      placeholder: "Name",
      adornment: <img src={nameAdornment} alt="name" />,
    },
    email: {
      helperText: "Please enter a valid email",
      placeholder: "Email",
      adornment: (
        <div className={classes.emailAdornment}>
          <Email color={theme.palette.common.WHITE} />
        </div>
      ),
    },
    phone: {
      helperText: "Phone number format is 0123456789",
      placeholder: "Phone Number",
      adornment: <img src={phone} alt="phone" />,
    },
    message: {
      helperText: "Message must be longer than 10 characters",
      placeholder: "Message",
      inputClasses: {
        multiline: classes.multiline,
        error: classes.multilineError,
      },
    },
  }

  const info = [
    {
      label: <span>Luke's Academy, {matchesXS ? <br /> : null} Endor</span>,
      icon: <img src={address} alt="address" className={classes.contactIcon} />,
    },
    {
      label: "012 345 6789",
      icon: <img src={phone} alt="phone" className={classes.contactIcon} />,
    },
    {
      label: "SUKD1600666@segi4u.my",
      icon: (
        <div className={classes.contactEmailIcon}>
          <Email color="#FFF" />
        </div>
      ),
    },
  ]

  const [errors, setErrors] = useState({})

  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const disabled =
    Object.keys(errors).some(
      error => errors[error] === true // so like errors.email === true
    ) || Object.keys(errors).length !== 4
  return (
    <Layout>
      <Grid
        container
        justify="space-around"
        alignItems="center"
        classes={{ root: classes.mainContainer }}
        direction={matchesMD ? "column" : "row"}
      >
        {/* contact info */}
        <Grid item>
          <Grid
            container
            direction="column"
            justify="space-between"
            classes={{ root: classes.infoContainer }}
          >
            {info.map((section, i) => (
              <Grid
                item
                key={section.label}
                container
                alignItems="center"
                classes={{ root: i === 1 ? classes.middleInfo : undefined }}
              >
                <Grid item classes={{ root: classes.iconContainer }}>
                  {section.icon}
                </Grid>
                <Typography
                  variant="h2"
                  classes={{ root: classes.contactInfo }}
                >
                  {section.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* contact form */}
        <Grid item classes={{ root: classes.formWrapper }}>
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            classes={{ root: classes.formContainer }}
          >
            <Grid
              item
              classes={{
                root: clsx(classes.titleContainer, classes.blockContainer),
              }}
            >
              <Typography variant="h4">Contact Us</Typography>
            </Grid>

            <Grid item>
              <Grid container direction="column">
                {Object.keys(fields).map(field => {
                  const validateHelper = e => {
                    return validate({ [field]: e.target.value })
                  }
                  return (
                    <Grid
                      item
                      key={field}
                      classes={{
                        root:
                          field === "message"
                            ? classes.multilineContainer
                            : classes.fieldContainer,
                      }}
                    >
                      <TextField
                        placeholder={fields[field].placeholder}
                        value={values[field]} // same as values.email values.name , etc.
                        onChange={e => {
                          const valid = validateHelper(e)

                          if (errors[field] || valid[field] === true) {
                            setErrors({ ...errors, [field]: !valid[field] })
                          }
                          setValues({ ...values, [field]: e.target.value })
                        }}
                        onBlur={e => {
                          const valid = validateHelper(e)
                          setErrors({ ...errors, [field]: !valid[field] })
                        }}
                        error={errors[field]}
                        helperText={errors[field] && fields[field].helperText}
                        classes={{ root: classes.textField }}
                        multiline={field === "message"}
                        rows={field === "message" ? 8 : undefined}
                        InputProps={{
                          classes: {
                            input: classes.input,
                            ...fields[field].inputClasses,
                          },
                          disableUnderline: field === "message",
                          startAdornment:
                            field === "message" ? undefined : (
                              <InputAdornment position="start">
                                {fields[field].adornment}
                              </InputAdornment>
                            ),
                        }}
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>

            <Grid
              item
              classes={{
                root: clsx(classes.buttonContainer, classes.blockContainer, {
                  [classes.buttonDisabled]: disabled,
                }),
              }}
              component={Button}
              disabled={disabled}
            >
              <Typography variant="h4" classes={{ root: classes.sendMessage }}>
                Send Message
              </Typography>
              <img src={send} alt="send message" className={classes.sendIcon} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default ContactPage
