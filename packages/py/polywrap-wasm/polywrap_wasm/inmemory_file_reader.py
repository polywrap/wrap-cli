from .file_reader import IFileReader


class InMemoryFileReader:
    @staticmethod
    def _from(base_file_reader: IFileReader):
        def read_file(file_path: str):
            return base_file_reader.read_file(file_path)

        return {
            "read_file": read_file
        }
