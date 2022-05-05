import React from "react";
import "./PizzaForm.css";
import { Form, Field } from "react-final-form";
import axios from "axios";
import swal from "sweetalert";


const onSubmit = async (values) => {
  if (!values) return
  if (values.type === "pizza") {
    delete values.spiciness_scale;
    delete values.slices_of_bread;
  } else if (values.type === "soup") {
    delete values.no_of_slices;
    delete values.diameter;
    delete values.slices_of_bread;
  } else if (values.type === "sandwich") {
    delete values.no_of_slices;
    delete values.diameter;
    delete values.spiciness_scale;
  }

  const tempPreperationTimeStore = [
    values.preparation_time_hours,
    values.preparation_time_minutes,
    values.preparation_time_seconds,
  ];

  if (values.preparation_time_hours < 10) {
    values.preparation_time_hours = `0${values.preparation_time_hours}`;
  }
  if (values.preparation_time_minutes < 10) {
    values.preparation_time_minutes = `0${values.preparation_time_minutes}`;
  }
  if (values.preparation_time_seconds < 10) {
    values.preparation_time_seconds = `0${values.preparation_time_seconds}`;
  }

  values.preparation_time = `${values.preparation_time_hours}:${values.preparation_time_minutes}:${values.preparation_time_seconds}`;
  delete values.preparation_time_hours;
  delete values.preparation_time_minutes;
  delete values.preparation_time_seconds;

  axios
    .post("https://frosty-wood-6558.getsandbox.com:443/dishes", values)
    .then((response) => {
      swal({
        title: "Dish added to database!",
        text: JSON.stringify(response.data, 0, 2),
        icon: "success",
        dangerMode: true,
      })
    })
    .catch((error) => {
      swal({
        title: "There has been an error :(",
        text: JSON.stringify(error.response.data, 0, 2),
        icon: "error",
        dangerMode: true,
      })
      console.error(error);
    });
  values.preparation_time_hours = tempPreperationTimeStore[0];
  values.preparation_time_minutes = tempPreperationTimeStore[1];
  values.preparation_time_seconds = tempPreperationTimeStore[2];
};

const checkSlicesNumber = (value) => {
  if (value > 20) {
    value = 20;
  }
  if (value < 1) {
    value = 1;
  }
  return parseInt(value);
};

const checkPreperation = (value) => {
  if (value > 59) {
    value = 59;
  }
  if (value < 1) {
    value = 0;
  }
  return parseInt(value);
}

const checkDiameter = (value) => {
  if (value > 100) {
    value = 100;
  }
  if (value < 1) {
    value = 1;
  }
  return parseFloat(value);
};

const checkSpiceness = (value) => {
  if (value > 10) {
    value = 10;
  }
  if (value < 1) {
    value = 1;
  }

  return parseInt(value);
};

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => {
      return value === is ? children : null;
    }}
  </Field>
);

const PizzaForm = () => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit, submitting, pristine, form }) => (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <Field
            name="name"
            component="input"
            type="text"
            placeholder="Name"
            required
          />
        </div>
        <div className="preperation-time">
          <label>Preperation Time</label>
          <div>
            <Field
              name="preparation_time_hours"
              component="input"
              type="number"
              initialValue={0}
              min="0"
              max="59"
              parse={checkPreperation}
              />
            <p className="hours">h</p>
            <Field
              name="preparation_time_minutes"
              component="input"
              type="number"
              initialValue={0}
              min="0"
              max="59"
              parse={checkPreperation}
              />
            <p className="minutes">m</p>
            <Field
              name="preparation_time_seconds"
              component="input"
              type="number"
              initialValue={0}
              min="0"
              max="59"
              parse={checkPreperation}
            />
            <p className="seconds">s</p>
          </div>
        </div>
        <div>
          <label>Type</label>
          <Field name="type" component="select" initialValue={"pizza"}>
            <option value="pizza">🍕 Pizza</option>
            <option value="soup">🥣 Soup</option>
            <option value="sandwich">🥪 Sandwich</option>
          </Field>
        </div>
        <div className="condition-fields">
          <Condition when="type" is="pizza">
            <div>
              <label>Number of slices</label>
              <Field
                name="no_of_slices"
                component="input"
                type="number"
                placeholder="1"
                parse={checkSlicesNumber}
                required
              />
            </div>
            <div>
              <label>Diameter</label>
              <Field
                name="diameter"
                component="input"
                type="number"
                placeholder="20.5"
                step="0.1"
                min="1"
                max="100"
                parse={checkDiameter}
                required
              />
            </div>
          </Condition>
          <Condition when="type" is="soup">
            <div>
              <label>Spiciness Scale (1-10)</label>
              <Field
                name="spiciness_scale"
                component="input"
                type="number"
                placeholder="5"
                min="1"
                max="10"
                parse={checkSpiceness}
                required
              />
            </div>
          </Condition>
          <Condition when="type" is="sandwich">
            <div>
              <label>Slices of Bread</label>
              <Field
                name="slices_of_bread"
                component="input"
                type="number"
                placeholder="1"
                min="1"
                max="100"
                parse={checkSlicesNumber}
                required
              />
            </div>
          </Condition>
        </div>
        <div className="buttons">
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
          <button
            type="button"
            onClick={form.reset}
            disabled={submitting || pristine}
          >
            Reset
          </button>
        </div>
      </form>
    )}
  />
);

export default PizzaForm;
