declare interface IFormSubmittedData {
  __rvfInternalFormId: string;
  item: string;
  date: string;
  category: {
    Category: string;
    Code: string;
    Group: string;
    Necessary: string;
  };
  account: {
    Account: string;
    Type: string;
  };
  amount: string;
}
