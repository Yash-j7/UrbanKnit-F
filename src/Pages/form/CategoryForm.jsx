import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-3">
          <input
            type="text"
            className="input input-bordered input-success w-full max-w-xs mt-2 ml-2"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary ml-2">
          Submit
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
