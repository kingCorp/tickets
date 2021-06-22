import React, { useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import BASE_API from "../../constants/uri";
import swal from "sweetalert";
import "./styles.scss";

import { useQuery } from "react-query";
import { fetchTickets } from "../../query/events";
import { Spinner } from "react-bootstrap";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import QRCode from "qrcode.react";
import dayjs from "dayjs";

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const EventsDetails = (props) => {
  const {
    match: { params },
  } = props;
  const history = useHistory();
  const { status, data, refetch } = useQuery(
    ["event.tickets", params.id],
    fetchTickets
  );
  const [form, setForm] = useState({
    code: "",
    phone: "",
    price: "",
    quantity: "",
    succ: false,
  });
  const [formEdit, setFormEdit] = useState({
   // code: "",
    phone: "",
    price: "",
    quantity: "",
    succ: false,
  });

  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const columns = [
    {
      title: "Ticket code", field: "code", render: ticket =>
        <small>{ticket.code}</small>
    },
    {
      title: "Phone", field: "phone", render: ticket =>
        <small>{ticket.phone}</small>
    },
    {
      title: "Price", field: "price", type: "numeric", render: ticket =>
        <small>{ticket.price}</small>
    },
    {
      title: "Quantity", field: "quantity", type: "numeric", render: ticket =>
        <small>{ticket.quantity}</small>
    },
    {
      title: "Status", field: "status", render: ticket =>
        <span className={ticket.status === "pending" ? "badge badge-warning" : "badge badge-success"}>{ticket.status}</span>
    },
    {
      title: "Corkage", field: "corkage", render: ticket =>
        <span className={ticket.corkage === "pending" ? "badge badge-warning" : "badge badge-success"}>{ticket.corkage}</span>
    },
    {
      title: "Date", field: "date", render: ticket =>
        <small>{dayjs(ticket.date).format('YYYY-MM-DD')}</small>
    },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const createTicket = async () => {
    const ticketdata = {
      ...form,
      code: form.code.toUpperCase(),
    };
    try {
      const res = await axios.post(
        `${BASE_API}/ticket/${params.id}`,
        ticketdata
      );
      if (res.data.hasError) {
        swal("Failed", res.data.message, "error");
      } else {
        swal("Success", res.data.message, "success");
        setForm({ ...form, succ: true });
        refetch();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editTicket = async () => {
    const ticketdata = {
      ...formEdit,
     // code: formEdit.code.toUpperCase(),
    };
    try {
      const res = await axios.put(
        `${BASE_API}/ticket/${formEdit._id}`,
        ticketdata
      );
      if (res.data.hasError) {
        swal("Failed", res.data.message, "error");
      } else {
        swal("Success", res.data.message, "success");
        setFormEdit({ ...formEdit, succ: true });
        refetch();
        setOpenEdit(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTicket = async (id) => {
  
    try {
      const res = await axios.delete(
        `${BASE_API}/ticket/${id}`
      );
      if (res.data.hasError) {
        swal("Failed", res.data.message, "error");
      } else {
        swal("Deleted", "ticket deleted", "success");
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadQR = () => {
    // will implement soon
    const canvas = document.getElementById(form.code.toUpperCase());
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = form.code.toUpperCase();
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const onEditDialog = (ticket) => {
    setOpenEdit(true);
    setFormEdit({...formEdit,
    //code: ticket.code,
    phone: ticket.phone,
    _id: ticket._id,
    price: ticket.price,
    quantity: ticket.quantity
    })
  }

  const handleDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteTicket(id);
      } else {
        // swal("Your imaginary file is safe!");
      }
    });
  };



  if (status === "laoding") {
    return <Spinner />;
  }

  return (
    <>
      <Layout>
        <div>
          <div className=" row m-5">
            <div className="col-md-3 mb-2">
              <Button
                variant="contained"
                color="default"
                onClick={() => history.push(`/`)}
              >
                Home
              </Button>
            </div>

            <div className="col-md-3 mb-2">
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
              >
                New ticket
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push(`/scan`)}
              >
                scan ticket
              </Button>
            </div>
          </div>

          {form.succ && (
            <div className="m-5">
              <QRCode
                id={form.code.toUpperCase()}
                value={form.code.toUpperCase()}
                size={290}
                level={"H"}
                includeMargin={true}
              />
              <p>{form.code.toUpperCase()}</p>
              <a
                className="btn btn-primary"
                href=""
                onClick={downloadQR}
              >
                {" "}
                Download QR{" "}
              </a>
            </div>
          )}

          <div className="ticket-info">
            <div style={{ maxWidth: "100%", marginTop: 20, padding: 10 }}>
              <MaterialTable columns={columns} data={data} title="Tickets"

                actions={[
                  () => ({
                    // eslint-disable-next-line react/display-name
                    icon: () => <EditIcon />,
                    tooltip: 'Edit Ticket',
                    onClick: (
                      e,
                      data
                    ) => onEditDialog(data),
                  }),
                  () => ({
                    // eslint-disable-next-line react/display-name
                    icon: () => <DeleteIcon color='error' />,
                    tooltip: 'Delete Ticket',
                    onClick: (
                      e,
                      data
                    ) => handleDelete(data._id),
                  })
                ]}

                options={{
                  actionsColumnIndex: -1
                }}

              />
            </div>
          </div>
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Ticket</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="code"
              label="Ticket code"
              type="text"
              fullWidth
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            <TextField
              margin="dense"
              id="phone"
              label="Customer Phone number"
              type="text"
              fullWidth
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <TextField
              margin="dense"
              id="price"
              label="Price"
              type="number"
              fullWidth
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <TextField
              margin="dense"
              id="quantity"
              label="Quantity"
              type="number"
              fullWidth
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <TextField
              margin="dense"
              id="code"
              label="Passcode"
              type="password"
              fullWidth
              onChange={(e) => setForm({ ...form, passcode: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={createTicket} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Ticket</DialogTitle>
          <DialogContent>
            {/* <TextField
              autoFocus
              margin="dense"
              id="code"
              label="Ticket code"
              type="text"
              fullWidth
              value={formEdit.code}
              onChange={(e) => setFormEdit({ ...formEdit, code: e.target.value })}
            /> */}
            <TextField
              margin="dense"
              id="phone"
              label="Customer Phone number"
              type="text"
              fullWidth
              value={formEdit.phone}
              onChange={(e) => setFormEdit({ ...formEdit, phone: e.target.value })}
            />
            <TextField
              margin="dense"
              id="price"
              label="Price"
              type="number"
              fullWidth
              value={formEdit.price}
              onChange={(e) => setFormEdit({ ...formEdit, price: e.target.value })}
            />
            <TextField
              margin="dense"
              id="quantity"
              label="Quantity"
              type="number"
              fullWidth
              value={formEdit.quantity}
              onChange={(e) => setFormEdit({ ...formEdit, quantity: e.target.value })}
            />
            <TextField
              
              margin="dense"
              id="code"
              label="Passcode"
              type="password"
              fullWidth
              onChange={(e) => setFormEdit({ ...formEdit, passcode: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="primary">
              Cancel
            </Button>
            <Button onClick={editTicket} color="primary">
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default EventsDetails;
