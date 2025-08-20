import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  initialPage: number;
}

const Pagination = ({
  pageCount,
  onPageChange,
  initialPage,
}: PaginationProps) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      previousLabel="<"
      initialPage={initialPage}
      renderOnZeroPageCount={null}
      className={css.pagination}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      previousClassName={css.previous}
      nextClassName={css.next}
    />
  );
};

export default Pagination;
