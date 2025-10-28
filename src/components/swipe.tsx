import type React from "react";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { type SwipeEventData, useSwipeable } from "react-swipeable";

export type SwipeToRevealHandle = {
	reveal: () => void;
	close: () => void;
	cancel: () => void;
};

type SwipeActionType = "delete" | "bookmark";

interface SwipeToRevealProps {
	children: React.ReactNode;
	onAction?: () => void; // generic single callback
	revealWidth?: number;
	className?: string;
	onRevealChange?: (revealed: boolean) => void;
	type?: SwipeActionType; // determines appearance only
}

export const SwipeToReveal = forwardRef<
	SwipeToRevealHandle,
	SwipeToRevealProps
>(
	(
		{
			children,
			onAction,
			revealWidth = 96,
			className = "",
			onRevealChange,
			type = "delete",
		},
		ref,
	) => {
		const [tx, setTx] = useState(0);
		const [revealed, setRevealed] = useState(false);
		const dragging = useRef(false);
		const canceled = useRef(false);

		const clamp = (v: number, min: number, max: number) =>
			Math.min(Math.max(v, min), max);

		const setRevealedSafe = (next: boolean) => {
			setRevealed(next);
			onRevealChange?.(next);
		};

		useImperativeHandle(ref, () => ({
			reveal() {
				canceled.current = false;
				setRevealedSafe(true);
				setTx(-revealWidth);
			},
			close() {
				canceled.current = false;
				setRevealedSafe(false);
				setTx(0);
			},
			cancel() {
				canceled.current = true;
				dragging.current = false;
				setTx(revealed ? -revealWidth : 0);
			},
		}));

		const handlers = useSwipeable({
			onSwipeStart: () => {
				dragging.current = true;
				canceled.current = false;
			},
			onSwiping: (e: SwipeEventData) => {
				if (
					Math.abs(e.deltaY) > Math.abs(e.deltaX) &&
					Math.abs(e.deltaY) > 10
				) {
					canceled.current = true;
					setTx(revealed ? -revealWidth : 0);
					return;
				}
				if (canceled.current) return;

				const base = revealed ? -revealWidth : 0;
				const next =
					e.dir === "Left"
						? clamp(base - Math.abs(e.deltaX), -revealWidth, 16)
						: e.dir === "Right"
							? clamp(base + Math.abs(e.deltaX), -revealWidth, 16)
							: base;

				setTx(next);
			},
			onSwiped: (e) => {
				dragging.current = false;
				if (canceled.current) return;

				const velocity = Math.abs(e.velocity);
				const flickLeft = e.dir === "Left" && velocity > 0.8;
				const flickRight = e.dir === "Right" && velocity > 0.8;

				const nextRevealed = flickLeft
					? true
					: flickRight
						? false
						: Math.abs(e.deltaX) > revealWidth / 2
							? e.dir === "Left"
							: revealed;

				setRevealedSafe(nextRevealed);
				setTx(nextRevealed ? -revealWidth : 0);
			},
			preventScrollOnSwipe: true,
			trackMouse: true,
			delta: 5,
		});

		useEffect(() => {
			const onKey = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					canceled.current = true;
					dragging.current = false;
					setTx(revealed ? -revealWidth : 0);
				}
			};
			window.addEventListener("keydown", onKey);
			return () => window.removeEventListener("keydown", onKey);
		}, [revealed, revealWidth]);

		const handleAction = () => {
			onAction?.();
			setRevealedSafe(false);
			setTx(0);
		};

		return (
			<div className={`swipe-wrap ${className}`}>
				<div
					className={`swipe-bg swipe-bg-${type}`}
					style={{ width: revealWidth }}
					aria-hidden="true"
				>
					<button
						type="button"
						className="swipe-action-btn"
						onClick={handleAction}
						aria-label={type}
					>
						{type === "delete" ? <DeleteIcon /> : <BookmarkIcon />}
					</button>
				</div>

				<div
					{...handlers}
					className="swipe-content"
					style={{
						transform: `translateX(${tx}px)`,
						transition: dragging.current
							? "none"
							: "transform 180ms ease",
						touchAction: "pan-y",
						userSelect: "none",
					}}
				>
					{children}
				</div>
			</div>
		);
	},
);
SwipeToReveal.displayName = "SwipeToReveal";

function DeleteIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M3 6H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function BookmarkIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
