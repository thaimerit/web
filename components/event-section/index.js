import React, { useState } from "react";
import SildeHeader from "../slides/silde-header";
import CoverSlide from "../cover-slide/cover-slide";
import { EventSectionItem } from "./event-section-item";

export default function EventSection({ data, loading, title, subTitle }) {
    const [controlledSwiper, setControlledSwiper] = useState(null);

    const onPrev = () => {
        controlledSwiper.slidePrev();
    };

    const onNext = () => {
        controlledSwiper.slideNext();
    };

    const option = {
        paddingVerticalPercent: 6,
        ratio: 5 / 3,
    };

    return (
        <div className="mt-2">
            <SildeHeader
                title={title}
                subTitle={subTitle}
                loading={loading}
                onPrev={onPrev}
                onNext={onNext}
                canPrev={true}
                canNext={true}
            />
            <CoverSlide
                data={data}
                onSwiper={setControlledSwiper}
                itemRender={(item, index) => {
                    return (
                        <EventSectionItem
                            loading={loading}
                            data={item}
                            option={option}
                        />
                    );
                }}
            />
        </div>
    );
}
