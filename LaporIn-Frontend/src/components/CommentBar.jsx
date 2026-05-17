import React, { useEffect, useMemo, useState } from 'react'
import Input from './Input'
import Button from './button/Button'
import api from '../axios/axiosInstance';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

function CommentItem({ item, content, tick, setTick, isLoading, setIsLoading }) {

	function deleteComment() {
		const result = window.confirm("Apakah anda yakin akan menghapus komentar anda?");
		if (result) {
			setIsLoading(true);
			api.delete(`/comment?content=${content}&comment_id=${item.comment_id}`).then(() => {
				setTick(tick + 1);
			}).catch(err => {
				console.log(err);
			}).finally(() => {
				setIsLoading(false);
			});
		}
	}

	return (
		<div className='flex justify-between items-center border-b border-gray-300 py-3'>
			<div className='flex gap-5'>
				<div className='w-8 h-8 overflow-hidden rounded-full bg-gray-300'>

				</div>
				<div>
					<p className={`text-[12px]`}>{item.author_name} - <span className='text-gray-500 text-[10px]'>{dayjs(item.created_at).format('DD/MM/YYYY HH:mm')}</span></p>
					<p className='mt-1'>{item.comment_body}</p>
				</div>
			</div>
			<div>
				{
					item.is_owned && <p className='text-[12px] cursor-pointer' onClick={deleteComment}>Hapus</p>
				}
			</div>
		</div>
	)
}

function CommentBar({ content, content_id, tickProps }) {

	const [comments, setComments] = useState([]);
	const [tick, setTick] = useState(0);
	const [commentInput, setCommentInput] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const { isAuthenticated, user } = useAuth();

	function postComment() {
		setIsLoading(true);
		api.post(`/comment`, { content: content, id: content_id, comment_body: commentInput }).then(() => {
			setCommentInput("");
		}).catch(err => {
			console.log(err);
		}).finally(() => {
			setIsLoading(false);
			setTick(tick + 1);
		})
	}

	useEffect(() => {
		setIsLoading(true);
		api.get(`/comment?content=${content}&id=${content_id}`).then(res => {
			setComments(res.map((item) => ({ ...item, is_owned: user.userId === item.author_id })));
		}).catch(err => {
			console.log(err);
		}).finally(() => {
			setIsLoading(false);
		})
	}, [tick, user, tickProps])

	return (
		<div>
			<div className='border-b border-gray-400 pb-4 mt-10 mb-3'>
				<h1 className='text-2xl font-bold flex items-center'>Komentar<span className='text-[12px] font-normal ml-3 bg-gray-100 p-2 rounded-full'>{comments.length}</span></h1>
			</div>
			{
				isAuthenticated ?
					<div className=''>
						<Input
							type={`textarea`}
							label={`Tambahkan komentar`}
							value={commentInput}
							setValue={setCommentInput}
						/>
						<Button onClick={postComment} variant={`filled`}>Posting</Button>
					</div>
					:
					<div>
						<Button variant={`filled`}>Login untuk berkomentar</Button>
					</div>
			}
			{
				comments.length < 1 ?
					<div className='text-center mt-5 text-gray-400'>
						<p>Belum ada komentar</p>
					</div>
					:
					<div className='mt-5'>
						{
							comments.map((item, index) => (
								<CommentItem
									item={item}
									key={index}
									tick={tick}
									setTick={setTick}
									content={content}
									setIsLoading={setIsLoading}
								/>
							))
						}
					</div>
			}
		</div>
	)
}

export default CommentBar