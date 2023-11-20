import { useAppDispatch, useAppSelector } from '@/store';
import { ModalKey } from '@/constants/modal';
import { showModal } from '@/store/slice/modal';
import CreateCategory from './CreateCategory';
import CreateItem from './CreateItem';

const modalsMap: { [modalKey: string]: any } = {
  [ModalKey.CREATE_CATEGORY]: CreateCategory,
  [ModalKey.CERATE_ITEM]: CreateItem,
};

export function ModalContainer() {
  const dispatch = useAppDispatch();
  const { displayModal, onModalClose, ...rest } = useAppSelector(
    (state) => state.modal,
  );

  const handleModalClose = () => {
    dispatch(showModal(null));
  };

  if (!displayModal) {
    return null;
  }

  const modalProps = {
    onModalClose: () => {
      handleModalClose();
      onModalClose?.();
    },
    ...rest,
  };

  const DisplayedModal = modalsMap[displayModal];
  return <DisplayedModal {...modalProps} />;
}
