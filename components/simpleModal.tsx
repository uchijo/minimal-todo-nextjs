import React, { Dispatch, SetStateAction, useState } from "react";
import style from "./simpleModal.module.css";

export type ModalProps = {
  isOpen: boolean;
  isDismissible?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
};

export const SimpleModal = ({
  isOpen,
  setIsOpen,
  children,
  isDismissible = true,
}: ModalProps): JSX.Element => {
  return (
    <>
      {isOpen && (
        <div
          className={style.overlay}
          onClick={() => {
            if (isDismissible) {
              setIsOpen(false);
            }
          }}
        >
          <div
            className={style.modalBox}
            onClick={(e) => {
              // モーダル外側が押されたときのみ親コンポーネントのonClickが発火するように
              e.stopPropagation();
            }}
          >
            {children}
            <button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
};
