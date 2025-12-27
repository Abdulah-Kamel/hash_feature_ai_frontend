import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.item2}>
      <p className={styles.a}>الأختبارات</p>
      <p className={styles.a}>كروت الفلاش</p>
      <div className={styles.item}>
        <p className={styles.a2}>المراحل</p>
      </div>
    </div>
  );
}

export default Component;
