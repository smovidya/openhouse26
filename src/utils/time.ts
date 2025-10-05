const df = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric',
  month: 'short'
});

// const tf = new Intl.DateTimeFormat('th-TH', {
//   hour: '2-digit',
//   minute: '2-digit',
//   hour12: false
// });

export function toLocalDateString(date: Date) {
  return df.format(date);
}

// export function toLocalTimeString(date: Date) {
//   return tf.format(date);
// }

