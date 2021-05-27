import {
  convertDirectoryBlobToFormData
} from "../../mutation/convert";

describe('Convert functions tests', () => {

  test("convertDirectoryBlobToFormData", () => {
    const r = convertDirectoryBlobToFormData({
      directories: [
        {
          name: "dirA",
          files: [],
          directories: [
            {
              name: "dirAA",
              directories: [
                {
                  name: "dirAAA",
                  directories: [
                    {
                      name: "dirAAAA",
                      directories: [],
                      files: [
                        {
                          data: String.UTF8.encode("file_AAAA_0_data"),
                          name: "file_AAAA_0"
                        },
                      ]
                    }
                  ],
                  files: []
                }
              ],
              files: [
                {
                  data: String.UTF8.encode("file_AA_0_data"),
                  name: "file_AA_0"
                }
              ]
            },
            {
              name: "dirAB",
              directories: [
                {
                  name: "dirABA",
                  directories: [],
                  files: [
                    {
                      data: String.UTF8.encode("file_ABA_0_data"),
                      name: "file_ABA_0"
                    },
                    {
                      data: String.UTF8.encode("file_ABA_1_data"),
                      name: "file_ABA_1"
                    }
                  ]
                }
              ],
              files: [
                {
                  data: String.UTF8.encode("file_AB_0_data"),
                  name: "file_AB_0"
                }
              ]
            }
          ]
        }],
      files: [
        {
          data: String.UTF8.encode("file_0_data"),
          name: "file_0"
        },
        {
          data: String.UTF8.encode("file_1_data"),
          name: "file_1"
        }
      ]
    })

    expect(r).toStrictEqual(
      [
        {
          key: "file_0",
          data: "file_0_data",
          opts: {
            contentType: "application/octet-stream",
            fileName: "file_0",
            filePath: null
          }
        },
        {
          key: "file_1",
          data: "file_1_data",
          opts: {
            contentType: "application/octet-stream",
            fileName: "file_1",
            filePath: null
          }
        },
        {
          key: "dirA",
          data: null,
          opts: {
            contentType: "application/x-directory",
            fileName: "dirA",
            filePath: ""
          }
        },
        {
          key: "dirAA",
          data: null,
          opts: {
            contentType: "application/x-directory",
            fileName: "dirAA",
            filePath: ""
          }
        },
        {
          key: "file_AA_0",
          data: "file_AA_0_data",
          opts: {
            contentType: "application/octet-stream",
            fileName: "dirA%2FdirAA%2Ffile_AA_0",
            filePath: null
          }
        },
        {
          key: "dirAAA",
          data: null,
          opts: {
            contentType: "application/x-directory",
            fileName: "dirAAA",
            filePath: ""
          }
        },
        {
          key: "dirAAAA",
          data: null,
          opts: {
            contentType: "application/x-directory",
            fileName: "dirAAAA",
            filePath: ""
          }
        },
        {
          key: "file_AAAA_0",
          data: "file_AAAA_0_data",
          opts: {
            contentType: "application/octet-stream",
            fileName: "dirA%2FdirAA%2FdirAAA%2FdirAAAA%2Ffile_AAAA_0",
            filePath: null
          }
        },
        {
          key: "dirAB",
          data: null,
          opts: {
            contentType: "application/x-directory",
            fileName: "dirAB",
            filePath: ""
          }
        },
        {
          key: "file_AA_0",
          data: "file_AA_0_data",
          opts: {
            contentType: "application/octet-stream",
            fileName: "dirA%2FdirAB%2Ffile_AA_0",
            filePath: null
          }
        },
        {
          key: "dirABA",
          data: null,
          opts: {
            contentType: "application/x-directory",
            fileName: "dirABA",
            filePath: ""
          }
        },
        {
          key: "file_ABA_0",
          data: "file_ABA_0_data",
          opts: {
            contentType: "application/octet-stream",
            fileName: "dirA%2FdirAB%2FdirABA%2Ffile_ABA_0",
            filePath: null
          }
        },
        {
          key: "file_ABA_1",
          data: "file_ABA_1_data",
          opts: {
            contentType: "application/octet-stream",
            fileName: "dirA%2FdirAB%2FdirABA%2Ffile_ABA_1",
            filePath: null
          }
        }
      ]
    );
  });
});