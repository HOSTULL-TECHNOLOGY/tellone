"use client";

import { useEffect, useState } from "react";
import { canReturn, findOrder, requestReturn, type Order } from "@/lib/orders";
import { FormSuccess, SelectField, SubmitButton, TextArea, TextField, isNgPhone, simulate } from "@/components/ui/Form";
import { Notice } from "@/components/ui/Page";
import { useQueryParam } from "./hooks";

const REASONS = [
  { value: "wrong-size", label: "Wrong size" },
  { value: "damaged", label: "Damaged or faulty item" },
  { value: "wrong-item", label: "Wrong item sent" },
];

/** EC-22 returns request: within 7 days of delivery, wrong size or damage; refund to original method in 5 working days. */
export function ReturnsForm() {
  const pre = useQueryParam("order");
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");
  const [item, setItem] = useState("");
  const [reason, setReason] = useState("");
  const [outcome, setOutcome] = useState<"exchange" | "refund">("exchange");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (pre) {
      setNum(pre);
      const o = findOrder(pre);
      if (o) {
        setOrder(o);
        setPhone(o.buyer.phone);
      }
    }
  }, [pre]);

  useEffect(() => {
    setOrder(/^TBH-\d{2}-\d{6}$/i.test(num.trim()) ? findOrder(num) ?? null : null);
  }, [num]);

  if (done)
    return (
      <FormSuccess title={`Return request ${done} received`}>
        We&apos;ll confirm by SMS within one working day with pickup or drop-off instructions. {outcome === "refund" ? "Refunds go back to your original payment method within 5 working days of us receiving the item." : "Your exchange ships as soon as we receive the item."} (Prototype: no message is sent.)
      </FormSuccess>
    );

  return (
    <form
      className="form-panel"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const ne: Record<string, string> = {};
        if (!/^TBH-\d{2}-\d{6}$/i.test(num.trim())) ne.num = "Order numbers look like TBH-26-123456.";
        else if (!order) ne.num = "We can't find this order in this browser. Use the number from your receipt.";
        if (!isNgPhone(phone)) ne.phone = "Enter the mobile number used at checkout.";
        else if (order && order.buyer.phone.replace(/\D/g, "").slice(-10) !== phone.replace(/\D/g, "").slice(-10)) ne.phone = "This phone number doesn't match the order.";
        if (!item) ne.item = "Choose the item you're returning.";
        if (!reason) ne.reason = "Choose a reason.";
        if (reason === "damaged" && !photo) ne.photo = "Add a photo of the damage so we can process it quickly.";
        if (order && !canReturn(order)) ne.form = order.state === "Delivered" ? "This order was delivered more than 7 days ago, so it is outside the returns window." : `This order is “${order.state}”. Returns open once it has been delivered.`;
        setErrs(ne);
        if (Object.keys(ne).length) return;
        setBusy(true);
        await simulate();
        requestReturn(order!.number, `${REASONS.find((r) => r.value === reason)?.label}: ${item}${details ? ` — ${details}` : ""} (${outcome})`);
        setDone(`RET-${order!.number.slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`);
      }}
    >
      {errs.form && (
        <Notice tone="warn" title="Not eligible for return">
          {errs.form}
        </Notice>
      )}
      <div className="form-grid form-grid-2">
        <TextField label="Order number" required value={num} onChange={(e) => setNum(e.target.value.toUpperCase())} error={errs.num} placeholder="TBH-26-123456" />
        <TextField label="Mobile number used at checkout" required type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errs.phone} />
        <SelectField
          label="Item"
          required
          value={item}
          onChange={(e) => setItem(e.target.value)}
          error={errs.item}
          placeholder={order ? "Choose an item" : "Enter your order number first"}
          disabled={!order}
          options={(order?.lines ?? []).map((l) => `${l.name}${l.size ? ` (${l.size})` : ""}`)}
        />
        <SelectField label="Reason" required value={reason} onChange={(e) => setReason(e.target.value)} error={errs.reason} placeholder="Choose a reason" options={REASONS} />
        <fieldset className="plain span-2">
          <legend>What would you like?</legend>
          <div className="choice-row">
            <label className="choice">
              <input type="radio" name="ret-out" checked={outcome === "exchange"} onChange={() => setOutcome("exchange")} />
              <span>Exchange</span>
            </label>
            <label className="choice">
              <input type="radio" name="ret-out" checked={outcome === "refund"} onChange={() => setOutcome("refund")} />
              <span>Refund</span>
            </label>
          </div>
        </fieldset>
        <TextArea label="Anything else we should know?" value={details} onChange={(e) => setDetails(e.target.value)} className="span-2" maxLength={600} />
        <div className="field span-2">
          <label htmlFor="ret-photo">Photo{reason === "damaged" ? <span className="req"> *</span> : " (optional)"}</label>
          <input
            id="ret-photo"
            type="file"
            accept="image/*"
            className="input"
            aria-invalid={!!errs.photo}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return setPhoto(null);
              const r = new FileReader();
              r.onload = () => setPhoto(String(r.result));
              r.readAsDataURL(f);
            }}
          />
          <p className="field-hint">The photo stays on your device in this prototype — nothing is uploaded.</p>
          {errs.photo && <p className="field-error">{errs.photo}</p>}
          {photo && <img src={photo} alt="Preview of the photo you selected" className="ret-preview" />}
        </div>
      </div>
      <SubmitButton busy={busy}>Request return</SubmitButton>
    </form>
  );
}
