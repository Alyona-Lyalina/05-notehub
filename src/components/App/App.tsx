import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, createNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import type { Note } from "../../types/note";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const perPage = 12;

const App = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>(
    {
      queryKey: ["notes", page, debouncedSearchQuery],
      queryFn: () =>
        fetchNotes({ page, perPage, search: debouncedSearchQuery }),
      placeholderData: keepPreviousData,
    }
  );

  const { mutate: createNoteMutation } = useMutation<
    Note,
    Error,
    Omit<Note, "id" | "createdAt" | "updatedAt">
  >({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const handleCreateNote = (
    values: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => {
    createNoteMutation(values);
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  const showPagination = !!data && data.totalPages > 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        {showPagination && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={handlePageChange}
            initialPage={page - 1}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {!!data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p className={css.noNotes}>No notes found.</p>
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleCreateNote}
        />
         </Modal>
      )}
    </div>
  );
};

export default App;
