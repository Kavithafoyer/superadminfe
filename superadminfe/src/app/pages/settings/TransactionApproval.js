import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import { Checkbox, Radio, Typography } from "@mui/material";
import React from "react";
import Setting from "./Setting";

const TransactionApproval = () => {
  return (
    <>
      <JumboContentLayoutMain>
        <Setting />
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          Transaction Approvals
        </Typography>
        <Typography sx={{ fontSize: "14px" }} sx={{ fontWeight: 500 }}>
          Sales and Purchase transactions like Invoices, Purchase requisitions,
          Bill Payments etc are to be performed only on approvals
        </Typography>

        <Div>
          <Typography variant="h3" sx={{ pt: 1, pl: 5 }}>
            <Checkbox size="small" color="primary" /> Sales Transactions
          </Typography>
          <Typography variant="h3" sx={{ pt: 1, pl: 5 }}>
            <Checkbox size="small" /> Purchase Transactions
          </Typography>
        </Div>

        <Div
          className="card"
          sx={{
            width: "max-content",
            ml: 10,
            pr: 5,
          }}
        >
          <Div className="transaction-approval-checkbox">
            <Typography variant="h3" sx={{ pt: 1, pl: 10 }}>
              <Checkbox size="small" color="primary" /> Notify when transactions
              are submitted for approval
            </Typography>
            <Div sx={{ ml: 5 }}>
              <Typography variant="h3" sx={{ pt: 1, pl: 10 }}>
                <Radio size="small" color="primary" /> To all approvers
              </Typography>
              <Typography variant="h3" sx={{ pt: 1, pl: 10 }}>
                <Radio size="small" /> To specific email address
              </Typography>
            </Div>
          </Div>

          <Div className="transaction-approval-checkbox">
            <Typography variant="h3" sx={{ pt: 1, pl: 10 }}>
              <Checkbox size="small" /> Notify submitter when transaction is
              approved
            </Typography>
          </Div>
        </Div>
      </JumboContentLayoutMain>
    </>
  );
};

export default TransactionApproval;
