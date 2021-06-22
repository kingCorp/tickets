import React, { useEffect, useState } from "react";

import axios from "axios";
import BASE_API from "../../constants/uri";

import Button from "@material-ui/core/Button";
import Layout from "../../components/Layout";
import "./styles.scss";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";

import QrReader from 'react-qr-reader'

const Scan = (props) => {
    const history = useHistory();
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState({});
  const [info, setInfo] = useState({ err: false, succ: false, msg: '' });

  const getTicket = async () => {
    try {
      const res = await axios.get(`${BASE_API}/ticket/${code.toUpperCase()}`);
      if (res.data.hasError) {
        setInfo({ msg: res.data.message, err: true, succ: false });
        setTicket({})
      } else {
        setTicket(res.data.data);
        setInfo({ msg: res.data.message, err: false, succ: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const statusTicket = async () => {
    try {
      const res = await axios.get(`${BASE_API}/ticket/${code.toUpperCase()}/status`);
      if (res.data.hasError) {
        setInfo({ msg: res.data.message, err: true, succ: false });
      } else {
        setInfo({ msg: 'Approved', err: false, succ: true });
        getTicket();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const corkageTicket = async () => {
    try {
      const res = await axios.get(`${BASE_API}/ticket/${code.toUpperCase()}/corkage`);
      if (res.data.hasError) {
        setInfo({ msg: res.data.message, err: true, succ: false });
      } else {
        setInfo({ msg: 'Approved', err: false, succ: true });
        getTicket();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScan = data => {
    if (data) {
     console.log(data);
    }
  }
  const handleError = err => {
    console.error(err)
  }

  useEffect(() => {}, []);

  return (
    <>
      <Layout>
        <div className="scan">
        <div className="m-5">
          <Button variant="contained" color="default" onClick={() => history.push(`/`)}>
            home
          </Button>
          </div>
          <div className="scan-info">
            <div className="row mb-4">
              <TextField
                id="standard-basic"
                label="Code"
                className="mr-3"
                onChange={(e) => setCode(e.target.value)}
              />{" "}
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={getTicket}
              >
                Search ticket
              </Button>
            </div>
            {info.err && (
              <div className="alert alert-danger m-3">{info.msg}</div>
            )}

             {info.succ && (
              <div className="alert alert-success m-3">{info.msg}</div>
            )}

            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Code :{ticket?.code}
                </Typography>
                <Typography color="textSecondary">
                  Phone : {ticket?.phone}
                </Typography>
                <Typography color="textSecondary">
                  Price : {ticket?.price}
                </Typography>
                <Typography color="textSecondary">
                  Quantity : {ticket?.quantity}
                </Typography>
                <Typography color="textSecondary">
                  Status : <span className={ticket?.status==="pending" ? "badge badge-warning" : "badge badge-success"}>{ticket?.status}</span>
                </Typography>
                <Typography color="textSecondary">
                  Corkage : <span className={ticket?.corkage==="pending" ? "badge badge-warning" : "badge badge-success"}>{ticket?.corkage}</span>
                </Typography>
                <Typography color="textSecondary">
                  Event : {ticket?.event?.title}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="medium"
                  variant="contained"
                  color="secondary"
                  disabled={ticket?.status === "approved" || !ticket?.code}
                  onClick={statusTicket}
                >
                  {ticket?.status === "approved" ? "Approved" : "Allow access"}
                </Button>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  disabled={ticket?.corkage === "approved" || !ticket?.code}
                  onClick={corkageTicket}
                >
                  {ticket?.corkage === "approved"
                    ? "Collected"
                    : "Give corkage "}
                </Button>
              </CardActions>
            </Card>
            <div>
        {/* <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        /> */}
      </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Scan;
