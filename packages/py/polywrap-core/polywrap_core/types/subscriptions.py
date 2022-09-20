from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

from .query import QueryOptions


@dataclass(slots=True, kw_only=True)
class SubscriptionFrequency:
    """Defines the frequency of API invocations for an API subscription."""

    ms: Optional[int] = None
    sec: Optional[int] = None
    min: Optional[int] = None
    hours: Optional[int] = None


@dataclass(slots=True, kw_only=True)
class SubscribeOptions(QueryOptions):
    """
    Options required for a wrapper subscription.

    Args:
        frequency: The frequency of Wrapper invocations. Defaults to one query per minute.
    """

    frequency: Optional[SubscriptionFrequency] = None


@dataclass(slots=True, kw_only=True)
class Subscription(ABC):
    """
    A wrapper subscription, which implements the AsyncIterator protocol, is an AsyncIterable that yields query results at a specified frequency.
    """

    frequency: int
    """The frequency of API invocations"""
    is_active: bool
    """Indicates whether the subscription is currently active"""

    @abstractmethod
    def stop(self) -> None:
        """
        Stops subscription. If a query has been called but has not yet returned, that query will be completed and its result will be yielded.
        """

    # FIXME: this shouldn't be like this
    # @classmethod
    # @abstractmethod
    # async def async_iterator(cls):
    #     QueryApiResult


class SubscriptionHandler(ABC):
    @abstractmethod
    def subscribe(self, options: SubscribeOptions) -> Subscription:
        pass
