import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame3}>
      <div className={styles.frame}>
        <p className={styles.a}>اكتب هنا</p>
        <img src="../image/mi7ki5w4-gjdtdws.svg" className={styles.paperclip} />
      </div>
      <div className={styles.frame2}>
        <div className={styles.button}>
          <p className={styles.text}>ارسال</p>
          <img
            src="../image/mi7ki5w4-b5zis71.svg"
            className={styles.paperPlaneRight}
          />
        </div>
        <div className={styles.buttonIcon}>
          <img src="../image/mi7ki5w4-82mn7bp.svg" className={styles.paperclip} />
        </div>
        <div className={styles.buttonIcon}>
          <img src="../image/mi7ki5w4-4pvlfls.svg" className={styles.paperclip} />
        </div>
      </div>
    </div>
  );
}

export default Component;
