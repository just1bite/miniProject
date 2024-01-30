// 'use client';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { FormEvent, useState } from 'react';
// import CurrencyInput from 'react-currency-input-field';

// const apiEventCreate = 'https://localhost:8000/api/event/create';

// const eventCreate = () => {
//   const [data, setData] = useState({
//     title: '',
//     eventDescription: '',
//     price: '',
//     eventDate: '',
//     eventLocation: '',
//     seatCount: '',
//     promotions: '',
//     promotionCode: '',
//   });
//   const [showPromotionForm, setShowPromotionForm] = useState(false);
//   const router = useRouter();
//   const eventCreate = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios
//         .post(apiEventCreate, data, {
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json',
//             'Access-Control-Allow-Origin': '*',
//           },
//         })
//         .then((res) => res.data)
//         .catch((error) => console.log(error));
//       // if (response.success === true) {
//       //   router.push('/');
//       // }
//       if (response.data && response.data.success === true) {
//         router.push('/');
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handlePromotionsChange = (value: string) => {
//     setData({ ...data, promotions: value });
//     setShowPromotionForm(value === 'true');
//   };

//   return (
//     <div className="bg-[#2A0134]">
//       <form
//         onSubmit={eventCreate}
//         className={'flex flex-col text-2x gap-5 rounded-md p-10 bg-[#000]'}
//       >
//         <h1>Create Event</h1>
//         <span>
//           Title:
//           <input
//             required
//             type="textarea"
//             id="title"
//             name="title"
//             placeholder=" . . . "
//             className="text-white font-bold bg-[#000] border-b-2"
//             value={data.title}
//             onChange={(e) => setData({ ...data, title: e.target.value })}
//           />
//         </span>

//         <span>
//           Description:
//           <input
//             required
//             type="textarea"
//             id="eventDescription"
//             name="eventDescription"
//             placeholder=" . . . "
//             className="text-white font-bold bg-[#000] border-b-2"
//             value={data.eventDescription}
//             onChange={(e) =>
//               setData({ ...data, eventDescription: e.target.value })
//             }
//           />{' '}
//         </span>
//         <span>
//           Price:
//           <CurrencyInput
//             required
//             id="price"
//             name="price"
//             placeholder="0"
//             className="text-white font-bold bg-[#000] border-b-2"
//             value={data.price}
//             onValueChange={(value) => setData({ ...data, price: value || '' })}
//             prefix="IDR "
//             decimalsLimit={2}
//           />
//         </span>
//         <span>
//           Date:
//           <input
//             required
//             type="date"
//             id="eventDate"
//             name="eventDate"
//             className="text-white font-bold bg-[#000] border-b-2"
//             value={data.eventDate}
//             onChange={(e) => setData({ ...data, eventDate: e.target.value })}
//           />
//         </span>
//         <span>
//           Location:
//           <input
//             required
//             type="textarea"
//             id="eventLocation"
//             name="eventLocation"
//             placeholder=" . . . "
//             className="text-white font-bold bg-[#000] border-b-2"
//             value={data.eventLocation}
//             onChange={(e) =>
//               setData({ ...data, eventLocation: e.target.value })
//             }
//           />
//         </span>
//         <span>
//           Available Ticket:
//           <input
//             required
//             type="number"
//             id="seatCount"
//             name="seatCount"
//             placeholder="0"
//             className="text-white font-bold bg-[#000] border-b-2"
//             value={data.seatCount}
//             onChange={(e) => setData({ ...data, seatCount: e.target.value })}
//           />
//         </span>
//         <div>
//           <label>
//             Promo:{' '}
//             <input
//               type="radio"
//               name="promotions"
//               value="true"
//               checked={data.promotions === 'true'}
//               onChange={(e) => handlePromotionsChange(e.target.value)}
//             />{' '}
//             Yes
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="promotions"
//               value="false"
//               checked={data.promotions === 'false'}
//               onChange={(e) => handlePromotionsChange(e.target.value)}
//             />{' '}
//             No
//           </label>
//         </div>
//         {showPromotionForm && (
//           <div>
//             <label>
//               Promotion Code:
//               <input
//                 type="text"
//                 id="promotionCode"
//                 name="promotionCode"
//                 placeholder="Enter Promotion Code"
//                 className="text-white font-bold bg-[#000] border-b-2"
//                 value={data.promotionCode}
//                 onChange={(e) =>
//                   setData({ ...data, promotionCode: e.target.value })
//                 }
//               />
//             </label>
//           </div>
//         )}
//         <button className="text-align: justify-end" type="submit">
//           Create Event
//         </button>
//       </form>
//     </div>
//   );
// };

// export default eventCreate;

'use client';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

const apiEventCreate = 'https://localhost:8000/api/event/create';

const eventCreate = () => {
  const [data, setData] = useState({
    title: '',
    eventDescription: '',
    price: '',
    eventDate: '',
    eventLocation: '',
    seatCount: '',
    promotions: '',
    isFree: true,
    voucherCode: '',
  });
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const router = useRouter();

  const eventCreate = async (e: FormEvent) => {
    e.preventDefault();

    try {
      console.log(data);
      const response = await axios.post(
        apiEventCreate,
        {
          ...data,
          seatCount: parseInt(data.seatCount),
          price: parseInt(data.price),
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );

      handleResponse(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResponse = (response: AxiosResponse) => {
    if (response.data && response.data.success === true) {
      router.push('/');
      router.refresh();
    }
  };

  const handlePromotionsChange = (value: string) => {
    setData({ ...data, promotions: value });
    setShowPromotionForm(value === 'true');
  };

  return (
    <div className="bg-[#2A0134]">
      <form
        onSubmit={eventCreate}
        className={'flex flex-col text-2x gap-5 rounded-md p-10 bg-[#000]'}
      >
        <h1>Create Event</h1>
        <span>
          Title:
          <input
            required
            type="textarea"
            id="title"
            name="title"
            placeholder=" . . . "
            className="text-white font-bold bg-[#000] border-b-2"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </span>
        <span>
          Description:
          <input
            required
            type="textarea"
            id="eventDescription"
            name="eventDescription"
            placeholder=" . . . "
            className="text-white font-bold bg-[#000] border-b-2"
            value={data.eventDescription}
            onChange={(e) =>
              setData({ ...data, eventDescription: e.target.value })
            }
          />
        </span>
        <span>
          Price:
          <CurrencyInput
            required
            id="price"
            name="price"
            placeholder="0"
            className="text-white font-bold bg-[#000] border-b-2"
            value={data.price}
            onValueChange={(value) =>
              setData({ ...data, price: value || '', isFree: false })
            }
            prefix="IDR "
            decimalsLimit={2}
          />
        </span>
        <span>
          Date:
          <input
            required
            type="date"
            id="eventDate"
            name="eventDate"
            className="text-white font-bold bg-[#000] border-b-2"
            value={data.eventDate}
            onChange={(e) => setData({ ...data, eventDate: e.target.value })}
          />
        </span>
        <span>
          Location:
          <input
            required
            type="textarea"
            id="eventLocation"
            name="eventLocation"
            placeholder=" . . . "
            className="text-white font-bold bg-[#000] border-b-2"
            value={data.eventLocation}
            onChange={(e) =>
              setData({ ...data, eventLocation: e.target.value })
            }
          />
        </span>
        <span>
          Available Ticket:
          <input
            required
            type="number"
            id="seatCount"
            name="seatCount"
            placeholder="0"
            className="text-white font-bold bg-[#000] border-b-2"
            value={data.seatCount}
            onChange={(e) => setData({ ...data, seatCount: e.target.value })}
          />
        </span>
        <div>
          <label>
            Promo:{' '}
            <input
              type="radio"
              name="promotions"
              value="true"
              checked={data.promotions === 'true'}
              onChange={(e) => handlePromotionsChange(e.target.value)}
            />{' '}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="promotions"
              value="false"
              checked={data.promotions === 'false'}
              onChange={(e) => handlePromotionsChange(e.target.value)}
            />{' '}
            No
          </label>
        </div>
        {showPromotionForm && (
          <div>
            <label>
              Promotion Code:
              <input
                type="text"
                id="voucherCode"
                name="voucherCode"
                placeholder="Enter Promotion Code"
                className="text-white font-bold bg-[#000] border-b-2"
                value={data.voucherCode}
                onChange={(e) =>
                  setData({ ...data, voucherCode: e.target.value })
                }
              />
            </label>
          </div>
        )}
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default eventCreate;
