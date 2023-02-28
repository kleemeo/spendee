import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import categories from '~/data/categories.json';

interface Category {
  Category: string;
  Code: number;
  Group: string;
  Necessary: string;
}

const UpDownIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
    />
  </svg>
);

const activeStyle = (active: boolean) =>
  `px-2 ${
    active ? `bg-gray-300 text-gray-600 cursor-default select-none` : ''
  }`;

const ComboBox = () => {
  const [selectedCat, setSelectedCat] = useState(categories[0]);
  const [query, setQuery] = useState('');

  const filteredCat = selectedCat
    ? categories.filter((cat) => {
        return (
          cat.Category.toLowerCase().includes(query.toLowerCase()) ||
          cat.Code.toString().includes(query)
        );
      })
    : [];

  return (
    <>
      <input name='categories' value={selectedCat.Category} hidden></input>
      <Combobox value={selectedCat} onChange={setSelectedCat}>
        <div className='relative w-full cursor-default overflow-hiddentext-left shadow-md'>
          <Combobox.Input
            displayValue={(cat: Category) =>
              `${cat.Code.toString()} - ${cat.Category}`
            }
            onChange={(event) => setQuery(event.target.value)}
            className='px-2 py-2 shadow-sm ring-[.5px] ring-gray-700 placeholder:text-gray-500 focus:ring-1 focus:outline-none focus:ring-gray-300 block w-full sm:text-sm border-gray-300 rounded-md'
          />
          <Combobox.Button className='absolute inset-y-0 right-1'>
            <UpDownIcon />
          </Combobox.Button>
        </div>
        <Combobox.Options className='absolute mt-1 max-h-60 min-w-[24rem] overflow-auto bg-[var(--mauve2)] text-gray-300  min-w-sm select-none scrollbar-hide z-50'>
          {filteredCat.map((cat) => (
            <Combobox.Option key={cat.Category} value={cat} className='w-full'>
              {({ active, selected }) => (
                <li className={activeStyle(active)}>
                  {cat.Code} - {cat.Category}
                </li>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </>
  );
};

export default ComboBox;
