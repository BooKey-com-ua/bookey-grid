import { RESULT_CODE } from '../Constants/messages';

const basicFetch = async (path: string, props) => {
  const controller = new AbortController();
  return fetch(path, { ...props, signal: controller.signal })
    .then((response) => {
      const { status } = response;
      if (status === 500) return { result: false, status: status };
      if (status === 404) return { result: false, message: RESULT_CODE.API_CONNECTION_ERROR };
      return response.json();
    })
    .catch(() => ({ result: false, message: RESULT_CODE.OFFLINE }))
    .finally(() => controller.abort());
};

//* ------------------  Bookings related endpoints -------------------------

export const bookingRequest = (values) => basicFetch(`${document.location.origin}/wp-json/bookey/request/add`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });

export const getRequests = (values) => basicFetch(`${document.location.origin}/wp-json/bookey/request/get`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });

export const rejectRequest = (values) => basicFetch(`${document.location.origin}/wp-json/bookey/request/reject`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });

export const approveRequest = (values) => basicFetch(`${document.location.origin}/wp-json/bookey/request/approve`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
